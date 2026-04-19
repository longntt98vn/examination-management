import { Request, Response } from 'express';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { evatuateTransaction } from '../utils/fabric';
import { logger } from '../utils/logger';
import { addSubmitTransactionJob } from '../utils/jobs';
import { Queue } from 'bullmq';
import { ContractError } from '../utils/errors';

const { NOT_FOUND, INTERNAL_SERVER_ERROR, ACCEPTED } = StatusCodes;

export const createScore = async (req: Request, res: Response) => {
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

    return res.status(ACCEPTED).json({
        status: getReasonPhrase(ACCEPTED),
        jobId,
    });
};

export const getScore = async (req: Request, res: Response) => {
    const scoreId = req.params.scoreId;
    logger.debug('Read score request received for score ID %s', scoreId);

    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.scoreContract as Contract;

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
            return res.status(NOT_FOUND).json({
                status: getReasonPhrase(StatusCodes.NOT_FOUND),
                timestamp: new Date().toISOString(),
            });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
};

export const getAllScores = async (req: Request, res: Response) => {
    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.scoreContract as Contract;

        const data = await evatuateTransaction(contract, 'GetAllScores');
        const scores = JSON.parse(data.toString());

        return res.status(200).json(scores);
    } catch (err) {
        logger.error({ err }, 'Error processing read all scores request');

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
