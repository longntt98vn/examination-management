import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    updateCandidates,
    getAllCandidatesOnChain,
    getCandidate,
    getCandidateByConditions,
} from '../services/candidate.service';
import { CandidateStatus } from '../config/constants';

export const candidateRouter = express.Router();

candidateRouter.post(
    '/',
    body().isArray(),
    body('*.candidateId', 'must be a string').notEmpty().optional(),
    body('*.examId', 'must be a string').notEmpty(),
    body('*.scoreId', 'must be a string').notEmpty().optional(),
    body('*.userId', 'must be a string').notEmpty(),
    body('*.isDeleted', 'must be a boolean').isBoolean().optional(),
    body('*.status', 'must be a number')
        .isIn([
            CandidateStatus.PENDING,
            CandidateStatus.APPROVED,
            CandidateStatus.REJECTED,
        ])
        .optional(),

    async (req: Request, res: Response) => {
        return await updateCandidates(req, res);
    }
);

candidateRouter.get('/:candidateId', async (req: Request, res: Response) => {
    return await getCandidate(req, res);
});

candidateRouter.get('/', async (req: Request, res: Response) => {
    if (req.query.getOnChain === 'true') {
        return await getAllCandidatesOnChain(req, res);
    }

    return await getCandidateByConditions(req, res);
});
