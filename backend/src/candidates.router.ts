import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { evatuateTransaction } from './fabric';
import { addSubmitTransactionJob } from './jobs';
import { logger } from './logger';

export const candidatesRouter = express.Router();

candidatesRouter.post(
    '/api/candidates',
    body().isObject(),
    body('ID', 'must be a string').notEmpty(),
    body('FullName', 'must be a string').notEmpty(),
    // ... validation cho các fields khác
    async (req: Request, res: Response) => {
        // Logic tạo candidate
        const mspId = req.user as string;
        const candidateContract = req.app.locals[mspId]
            ?.candidateContract as Contract;

        const jobId = await addSubmitTransactionJob({
            channelName: candidateContract.getChannelName(),
            chaincodeName: candidateContract.getChaincodeId(),
            transaction: 'CreateCandidate',
            args: [
                req.body.ID,
                req.body.FullName,
                req.body.DateOfBirth,
                req.body.IdentityCard,
                req.body.Email,
                req.body.Phone,
                req.body.ExamRoom,
                req.body.ExamDate,
                req.body.RegisteredBy,
                req.body.RegisteredDate,
            ],
            mspId,
        });

        return res.status(StatusCodes.ACCEPTED).json({
            status: getReasonPhrase(StatusCodes.ACCEPTED),
            jobId,
        });
    }
);

candidatesRouter.get('/api/candidates', async (req: Request, res: Response) => {
    // Logic lấy danh sách candidates
});

candidatesRouter.get(
    '/api/candidates/:candidateId',
    async (req: Request, res: Response) => {
        // Logic lấy chi tiết candidate
    }
);
