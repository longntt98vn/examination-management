import { Queue } from 'bullmq';
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { ContractError } from '../errors';
import { evatuateTransaction } from '../fabric';
import { addSubmitTransactionJob } from '../jobs';
import { logger } from '../logger';

export const examRouter = express.Router();
const { BAD_REQUEST, ACCEPTED, INTERNAL_SERVER_ERROR, NOT_FOUND } = StatusCodes;

examRouter.post(
    '/',
    body().isObject(),
    body('ExamID', 'must be a string').notEmpty(),
    body('HashCode', 'must be a string').notEmpty(),

    async (req: Request, res: Response) => {
        logger.debug('Create exam request received');
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
    }
);

examRouter.get('/:examId', async (req: Request, res: Response) => {
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
});
