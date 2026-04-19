import { Request, Response } from 'express';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { evatuateTransaction } from '../utils/fabric';
import { logger } from '../utils/logger';
import { addSubmitTransactionJob } from '../utils/jobs';
import { Queue } from 'bullmq';
import { ContractError } from '../utils/errors';

const { NOT_FOUND, INTERNAL_SERVER_ERROR, ACCEPTED } = StatusCodes;

export const createCandidate = async (req: Request, res: Response) => {
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

    return res.status(ACCEPTED).json({
        status: getReasonPhrase(ACCEPTED),
        jobId,
    });
};

export const getCandidate = async (req: Request, res: Response) => {
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

export const getAllCandidates = async (req: Request, res: Response) => {
    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.candidateContract as Contract;

        const data = await evatuateTransaction(contract, 'GetAllCandidates');
        const candidates = JSON.parse(data.toString());

        return res.status(200).json(candidates);
    } catch (err) {
        logger.error({ err }, 'Error processing read all candidates request');

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
