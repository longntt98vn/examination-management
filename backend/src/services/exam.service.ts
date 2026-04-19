import { Request, Response } from 'express';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { evatuateTransaction } from '../utils/fabric';
import { logger } from '../utils/logger';
import { addSubmitTransactionJob } from '../utils/jobs';
import { Queue } from 'bullmq';
import { ContractError } from '../utils/errors';
import { validationResult } from 'express-validator';

const { NOT_FOUND, INTERNAL_SERVER_ERROR, ACCEPTED, BAD_REQUEST } = StatusCodes;

export const createExam = async (req: Request, res: Response) => {
    const mspId = req.user as string;
    const errors = validationResult(req);
    logger.debug(errors.array(), 'Validation errors');
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

export const getExam = async (req: Request, res: Response) => {
    const examId = req.params.examId;
    logger.debug('Read exam request received for exam ID %s', examId);

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

export const getAllExams = async (req: Request, res: Response) => {
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
