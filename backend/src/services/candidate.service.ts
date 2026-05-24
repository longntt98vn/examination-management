import { Request, Response } from 'express';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { evatuateTransaction } from '../utils/fabric';
import { logger } from '../utils/logger';
import { addSubmitTransactionJob } from '../utils/jobs';
import { Queue } from 'bullmq';
import { ContractError } from '../utils/errors';
import { DBConnection } from '../utils/db-connection';
import { generateCandidateHashCode } from '../utils/hash-code';
import { CandidateStatus } from '../config/constants';

const { NOT_FOUND, INTERNAL_SERVER_ERROR, ACCEPTED } = StatusCodes;

export const updateCandidates = async (req: Request, res: Response) => {
    try {
        const mspId = req.user as string;
        const submitQueue = req.app.locals.jobq as Queue;
        const now = Date.now();
        const results = [];
        const blockchainJobs = [];

        for (const candidateData of req.body) {
            const { candidateId, userId, examId, scoreId, status } =
                candidateData;

            const existingCandidate = candidateData.candidateId
                ? await DBConnection.Candidate?.findOne({
                      _id: candidateId,
                      is_deleted: false,
                  })
                : undefined;

            if (existingCandidate) {
                const newStatus =
                    status ??
                    existingCandidate.status ??
                    CandidateStatus.PENDING;

                if (userId !== undefined) existingCandidate.user = userId;
                if (examId !== undefined) existingCandidate.exam = examId;
                if (scoreId !== undefined) existingCandidate.score = scoreId;
                existingCandidate.status = newStatus;

                const updateFields: any = { status: newStatus };
                if (userId !== undefined) updateFields.user = userId;
                if (examId !== undefined) updateFields.exam = examId;
                if (scoreId !== undefined) updateFields.score = scoreId;

                await DBConnection.Candidate?.updateOne(
                    { _id: existingCandidate._id },
                    { $set: updateFields }
                );

                const hashCode = generateCandidateHashCode(
                    existingCandidate._id.toString(),
                    existingCandidate.user.toString(),
                    existingCandidate.exam.toString(),
                    existingCandidate.score?.toString() || '',
                    newStatus,
                    now
                );

                const jobId = await addSubmitTransactionJob(
                    submitQueue,
                    mspId,
                    'CreateCandidate',
                    existingCandidate._id.toString(),
                    existingCandidate.exam.toString(),
                    hashCode
                );

                blockchainJobs.push(jobId);

                results.push({
                    candidateId: existingCandidate._id,
                    action: 'updated',
                    blockchainJobId: jobId,
                });
            } else {
                const newCandidate = await DBConnection.Candidate?.create({
                    user: userId,
                    exam: examId,
                    score: scoreId,
                    status: status ?? CandidateStatus.PENDING,
                });

                const hashCode = generateCandidateHashCode(
                    newCandidate._id.toString(),
                    userId,
                    examId,
                    scoreId || '',
                    status ?? CandidateStatus.PENDING,
                    now
                );

                newCandidate.hash = hashCode;
                await newCandidate.save();

                const jobId = await addSubmitTransactionJob(
                    submitQueue,
                    mspId,
                    'CreateCandidate',
                    newCandidate._id.toString(),
                    examId,
                    hashCode
                );

                blockchainJobs.push(jobId);

                results.push({
                    candidateId: newCandidate._id,
                    action: 'created',
                    blockchainJobId: jobId,
                });
            }
        }

        return res.status(StatusCodes.ACCEPTED).json({
            status: getReasonPhrase(StatusCodes.ACCEPTED),
            message: 'Candidates updated and blockchain jobs queued',
            data: results,
            blockchainJobs: blockchainJobs,
        });
    } catch (error) {
        logger.error({ error }, 'Error in updateCandidates');
        return res.status(500).json({
            status: 'Internal Server Error',
            message: 'Failed to update candidates',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

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

export const getAllCandidatesOnChain = async (req: Request, res: Response) => {
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

export const getCandidateByConditions = async (req: Request, res: Response) => {
    const { examId } = req.query;

    const candidates = await DBConnection.Candidate?.find({
        is_deleted: false,
        ...(examId && { exam: examId }),
    })
        .populate('user')
        .populate('exam')
        .populate('score')
        .lean();

    return res.status(200).json(candidates);
};
