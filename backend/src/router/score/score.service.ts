import { Request, Response } from 'express';
import { ScoreStatus } from '../../config/constants';
import { DBConnection } from '../../utils/db-connection';
import { Queue } from 'bullmq';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { ContractError } from '../../utils/errors';
import { evatuateTransaction } from '../../utils/fabric';
import { addSubmitTransactionJob } from '../../utils/jobs';
import { logger } from '../../utils/logger';
import { generateScoreHashCode } from '../../utils/hash-code';

const { NOT_FOUND, INTERNAL_SERVER_ERROR, ACCEPTED } = StatusCodes;

export const updateScores = async (req: Request, res: Response) => {
    try {
        const mspId = req.user as string;
        const submitQueue = req.app.locals.jobq as Queue;
        const now = Date.now();
        const results = [];
        const blockchainJobs = [];
        // Xử lý từng score trong mảng
        for (const scoreData of req.body) {
            const { candidateId, value, status } = scoreData;
            const existingScore = await DBConnection.Score?.findOne({
                candidate: candidateId,
                is_deleted: false,
            });
            if (existingScore) {
                // UPDATE case
                const oldValue = existingScore.value;
                const oldStatus = existingScore.status;
                const newStatus =
                    status ?? existingScore.status ?? ScoreStatus.NOT_SIGNED;
                existingScore.value = value;
                existingScore.status = newStatus;
                await DBConnection.Score?.updateOne(
                    { _id: existingScore._id },
                    { $set: { value: value, status: newStatus } }
                );
                await DBConnection.ScoreLog?.create({
                    score: existingScore._id,
                    user: req.senderInstance?._id,
                    value_before: oldValue,
                    value_after: value,
                    status_before: oldStatus,
                    status_after: newStatus,
                });
                // Đẩy lên blockchain (CreateScore transaction - chỉ cần 3 params)
                const hashCode = generateScoreHashCode(
                    existingScore._id.toString(),
                    candidateId,
                    value,
                    status,
                    now
                );
                const jobId = await addSubmitTransactionJob(
                    submitQueue,
                    mspId,
                    'CreateScore', // Tên transaction trong smart contract
                    existingScore._id.toString(), // ScoreID
                    candidateId, // CandidateID
                    hashCode // HashCode
                );
                blockchainJobs.push(jobId);
                results.push({
                    candidateId,
                    action: 'updated',
                    scoreId: existingScore._id,
                    blockchainJobId: jobId,
                });
            } else {
                // CREATE case
                const newScore = await DBConnection.Score?.create({
                    candidate: candidateId,
                    value: value,
                    status: status,
                });
                const hashCode = generateScoreHashCode(
                    newScore._id.toString(),
                    candidateId,
                    value,
                    status,
                    now
                );
                newScore.hash = hashCode;
                await newScore.save();
                await DBConnection.ScoreLog?.create({
                    score: newScore._id,
                    user: req.senderInstance?._id,
                    value_before: 0,
                    value_after: value,
                    status_before: ScoreStatus.NOT_SIGNED,
                    status_after: status,
                });
                // update scoreid to candidate
                await DBConnection.Candidate?.updateOne(
                    { _id: candidateId },
                    { $set: { score: newScore._id } }
                );
                // Đẩy lên blockchain (CreateScore transaction)
                const jobId = await addSubmitTransactionJob(
                    submitQueue,
                    mspId,
                    'CreateScore', // Tên transaction trong smart contract
                    newScore._id.toString(), // ScoreID
                    candidateId,
                    hashCode
                );
                blockchainJobs.push(jobId);
                results.push({
                    candidateId,
                    action: 'created',
                    scoreId: newScore._id,
                    blockchainJobId: jobId,
                });
            }
        }
        return res.status(StatusCodes.ACCEPTED).json({
            status: getReasonPhrase(StatusCodes.ACCEPTED),
            message: 'Scores updated and blockchain jobs queued',
            data: results,
            blockchainJobs: blockchainJobs,
        });
    } catch (error) {
        logger.error({ error }, 'Error in updateScores');
        return res.status(500).json({
            status: 'Internal Server Error',
            message: 'Failed to update scores',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const getScoreByConditions = async (req: Request, res: Response) => {
    const { candidateId } = req.query;

    const scores = await DBConnection.Score?.find({
        is_deleted: false,
        ...(candidateId && { candidate: candidateId }),
    });

    return res.status(200).json(scores);
};

export const getScoreOnChain = async (req: Request, res: Response) => {
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

export const getAllScoresOnChain = async (req: Request, res: Response) => {
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

export const getScoreHistory = async (req: Request, res: Response) => {
    const { scoreId } = req.query;

    const scoreHistory = await DBConnection.ScoreLog?.find({
        score: scoreId,
    });

    return res.status(200).json(scoreHistory);
};
