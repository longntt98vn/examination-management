import { Queue } from 'bullmq';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { ContractError } from '../errors';
import { evatuateTransaction } from '../fabric';
import { addSubmitTransactionJob } from '../jobs';
import { logger } from '../logger';

export const candidateRouter = express.Router();

candidateRouter.post(
    '/api/candidate',
    body().isObject(),
    body('CandidateID', 'must be a string').notEmpty(),
    body('ExamID', 'must be a string').notEmpty(),
    body('HashCode', 'must be a string').notEmpty(),

    async (req: Request, res: Response) => {
        const mspId = req.user as string;

        const submitQueue = req.app.locals.jobq as Queue;
        const jobId = await addSubmitTransactionJob(
            submitQueue,
            mspId,
            'CreateCandidate',
            req.body.CandidateID,
            req.body.ExamID,
            req.body.HashCode
        );

        return res.status(StatusCodes.ACCEPTED).json({
            status: getReasonPhrase(StatusCodes.ACCEPTED),
            jobId,
        });
    }
);

candidateRouter.get('/:candidateId', async (req: Request, res: Response) => {
    const candidateId = req.params.candidateId;
    logger.debug(
        'Read candidate request received for candidate ID %s',
        candidateId
    );

    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.candidateContract as Contract;

        const data = await evatuateTransaction(
            contract,
            'GetCandidate',
            candidateId.toString()
        );
        const candidate = JSON.parse(data.toString());

        return res.status(200).json(candidate);
    } catch (err) {
        logger.error(
            { err },
            'Error processing read candidate request for candidate ID %s',
            candidateId
        );

        if (err instanceof ContractError) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: getReasonPhrase(StatusCodes.NOT_FOUND),
                timestamp: new Date().toISOString(),
            });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
});
