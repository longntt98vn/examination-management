import { Queue } from 'bullmq';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { ContractError } from '../errors';
import { evatuateTransaction } from '../fabric';
import { addSubmitTransactionJob } from '../jobs';
import { logger } from '../logger';

export const scoreRouter = express.Router();

scoreRouter.post(
    '/',
    body().isObject(),
    body('ScoreID', 'must be a string').notEmpty(),
    body('CandidateID', 'must be a string').notEmpty(),
    body('HashCode', 'must be a string').notEmpty(),

    async (req: Request, res: Response) => {
        const mspId = req.user as string;

        const submitQueue = req.app.locals.jobq as Queue;
        const jobId = await addSubmitTransactionJob(
            submitQueue,
            mspId,
            'CreateScore',
            req.body.ScoreID,
            req.body.CandidateID,
            req.body.HashCode
        );

        return res.status(StatusCodes.ACCEPTED).json({
            status: getReasonPhrase(StatusCodes.ACCEPTED),
            jobId,
        });
    }
);

scoreRouter.get('/:scoreId', async (req: Request, res: Response) => {
    const scoreId = req.params.scoreId;
    logger.debug('Read score request received for score ID %s', scoreId);

    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.candidateContract as Contract;

        const data = await evatuateTransaction(
            contract,
            'GetScore',
            scoreId.toString()
        );
        const score = JSON.parse(data.toString());

        return res.status(200).json(score);
    } catch (err) {
        logger.error(
            { err },
            'Error processing read score request for score ID %s',
            scoreId
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
