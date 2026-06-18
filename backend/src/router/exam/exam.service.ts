import { Queue } from 'bullmq';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { DBConnection } from '../../utils/db-connection';
import { ContractError } from '../../utils/errors';
import { evatuateTransaction } from '../../utils/fabric';
import { generateExamHashCode } from '../../utils/hash-code';
import { addSubmitTransactionJob } from '../../utils/jobs';
import { logger } from '../../utils/logger';
import { checkSemesterExist } from '../semester/semester.service';
import { checkSubjectExist } from '../subject/subject.service';
import { checkUserExist } from '../user/user.service';
const { BAD_REQUEST, ACCEPTED, INTERNAL_SERVER_ERROR, NOT_FOUND } = StatusCodes;

export const createExamOnChain = async (req: Request, res: Response) => {
    const mspId = req.user as string;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(BAD_REQUEST).json({
            status: getReasonPhrase(BAD_REQUEST),
            reason: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            timestamp: new Date().toISOString(),
            errors: errors.array(),
        });
    }

    const submitQueue = req.app.locals.jobq as Queue;
    const jobId = await addSubmitTransactionJob(
        submitQueue,
        mspId,
        'CreateExam',
        req.body.ExamID,
        req.body.HashCode
    );

    return res.status(ACCEPTED).json({
        status: getReasonPhrase(ACCEPTED),
        jobId,
    });
};

export const createExam = async (req: Request, res: Response) => {
    try {
        const [semester, subject, teacher] = await Promise.all([
            checkSemesterExist(req.body.semesterId),
            checkSubjectExist(req.body.subjectId),
            checkUserExist(req.body.teacherId),
        ]);
        if (!semester || !subject || !teacher) {
            return res.status(BAD_REQUEST).json({
                status: getReasonPhrase(BAD_REQUEST),
                message: 'Semester, subject or teacher not found',
            });
        }

        const mspId = req.user as string;
        const submitQueue = req.app.locals.jobq as Queue;
        const now = Date.now();

        const exam = await DBConnection.Exam?.create({
            semester: req.body.semesterId,
            subject: req.body.subjectId,
            teacher: req.body.teacherId,
            name: req.body.name,
            exam_date: req.body.examDate,
            room_number: req.body.roomNumber,
            created_at: now,
            updated_at: now,
        });

        const hashCode = generateExamHashCode(
            exam._id.toString(),
            req.body.semesterId,
            req.body.subjectId,
            req.body.teacherId,
            req.body.name,
            req.body.examDate,
            req.body.roomNumber,
            now
        );

        exam.hash = hashCode;
        await exam.save();

        const jobId = await addSubmitTransactionJob(
            submitQueue,
            mspId,
            'CreateExam',
            `${exam._id}-${now}`,
            hashCode
        );

        return res.status(ACCEPTED).json({
            status: getReasonPhrase(ACCEPTED),
            message: 'Exam created and blockchain job queued',
            data: exam,
            blockchainJobId: jobId,
        });
    } catch (error) {
        logger.error({ error }, 'Error in createExam');
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            message: 'Failed to create exam',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const getExamById = async (req: Request, res: Response) => {
    const examId = req.params.examId;

    try {
        // Query exam với populate các references
        const exam = await DBConnection.Exam?.findById(examId)
            .populate('semester') // Populate semester
            .populate('subject') // Populate subject
            .populate('teacher') // Populate teacher
            .lean();

        if (!exam) {
            return res.status(NOT_FOUND).json({
                status: getReasonPhrase(NOT_FOUND),
                message: 'Exam not found',
                timestamp: new Date().toISOString(),
            });
        }

        const candidates = await DBConnection.Candidate?.find({
            exam: examId,
        })
            .populate('user')
            .populate('score')
            .lean();

        // Kết hợp data
        const examWithScores = {
            ...exam,
            candidates: candidates,
        };

        return res.status(200).json(examWithScores);
    } catch (err) {
        logger.error(
            { err },
            'Error processing get exam by ID request for exam ID %s',
            examId
        );

        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
};

export const getExams = async (req: Request, res: Response) => {
    const exams = await DBConnection.Exam?.find()
        .populate('semester')
        .populate('subject')
        .populate('teacher')
        .lean();
    return res.status(200).json(exams);
};

export const updateExam = async (req: Request, res: Response) => {
    try {
        const examId = req.body.examId;

        const existingExam = await DBConnection.Exam?.findById(examId);
        if (!existingExam) {
            return res.status(NOT_FOUND).json({
                status: getReasonPhrase(NOT_FOUND),
                message: 'Exam not found',
            });
        }

        const [semester, subject, teacher] = await Promise.all([
            checkSemesterExist(req.body.semesterId),
            checkSubjectExist(req.body.subjectId),
            checkUserExist(req.body.teacherId),
        ]);
        if (!semester || !subject || !teacher) {
            return res.status(BAD_REQUEST).json({
                status: getReasonPhrase(BAD_REQUEST),
                message: 'Semester, subject or teacher not found',
            });
        }

        const mspId = req.user as string;
        const submitQueue = req.app.locals.jobq as Queue;
        const now = Date.now();

        const hashCode = generateExamHashCode(
            examId,
            req.body.semesterId,
            req.body.subjectId,
            req.body.teacherId,
            req.body.name,
            req.body.examDate,
            req.body.roomNumber,
            now
        );

        const exam = await DBConnection.Exam?.findByIdAndUpdate(
            examId,
            {
                semester: req.body.semesterId,
                subject: req.body.subjectId,
                teacher: req.body.teacherId,
                name: req.body.name,
                exam_date: req.body.examDate,
                room_number: req.body.roomNumber,
                hash: hashCode,
                updated_at: now,
            },
            {
                returnDocument: 'after',
            }
        );

        const jobId = await addSubmitTransactionJob(
            submitQueue,
            mspId,
            'CreateExam',
            `${examId}-${now}`,
            hashCode
        );

        return res.status(ACCEPTED).json({
            status: getReasonPhrase(ACCEPTED),
            message: 'Exam updated and blockchain job queued',
            data: exam,
            blockchainJobId: jobId,
        });
    } catch (error) {
        logger.error({ error }, 'Error in updateExam');
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            message: 'Failed to update exam',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const deleteExam = async (req: Request, res: Response) => {
    const examId = req.params.examId;
    await DBConnection.Exam?.findByIdAndDelete(examId);
    return res.status(200).json({ message: 'Exam deleted successfully' });
};

export const getExamsOnChain = async (req: Request, res: Response) => {
    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.examContract as Contract;

        const data = await evatuateTransaction(contract, 'GetAllExams');
        const exams = JSON.parse(data.toString());

        return res.status(200).json(exams);
    } catch (err) {
        logger.error({ err }, 'Error processing read all exams request');

        if (err instanceof ContractError) {
            return res.status(NOT_FOUND).json({
                status: getReasonPhrase(NOT_FOUND),
                timestamp: new Date().toISOString(),
            });
        }

        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
};

export const getExamInfoOnChain = async (req: Request, res: Response) => {
    const examId = req.params.examId;

    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.examContract as Contract;

        const data = await evatuateTransaction(
            contract,
            'GetExam',
            examId.toString()
        );
        const exam = JSON.parse(data.toString());

        return res.status(200).json(exam);
    } catch (err) {
        logger.error(
            { err },
            'Error processing read exam request for exam ID %s',
            examId
        );

        if (err instanceof ContractError) {
            return res.status(NOT_FOUND).json({
                status: getReasonPhrase(NOT_FOUND),
                timestamp: new Date().toISOString(),
            });
        }

        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
};
