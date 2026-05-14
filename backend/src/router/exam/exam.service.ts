import { Queue } from 'bullmq';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { addSubmitTransactionJob } from '../../utils/jobs';
import { ContractError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { evatuateTransaction } from '../../utils/fabric';
import { Contract } from 'fabric-network';
const { BAD_REQUEST, ACCEPTED, INTERNAL_SERVER_ERROR, NOT_FOUND } = StatusCodes;

const db = global.DBConnection;

export const createExam = async (req: Request, res: Response) => {
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

export const getExamById = async (req: Request, res: Response) => {
    const examId = req.params.examId;

    try {
        // Query exam với populate các references
        const exam = await db.Exam.findById(examId)
            .populate('semester_ref') // Populate semester
            .populate('subject_ref') // Populate subject
            .populate('student_refs') // Populate students
            .lean();

        if (!exam) {
            return res.status(NOT_FOUND).json({
                status: getReasonPhrase(NOT_FOUND),
                message: 'Exam not found',
                timestamp: new Date().toISOString(),
            });
        }

        // Query tất cả scores liên quan đến exam này
        const scores = await db.Score.find({
            exam_id: examId,
        }).lean();

        // Kết hợp data
        const examWithScores = {
            ...exam,
            scores: scores,
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
    const exams = await db.Exam.find();
    return res.status(200).json(exams);
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
