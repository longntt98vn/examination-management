import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    createCandidate,
    getAllCandidates,
    getCandidate,
} from '../services/candidate.service';

export const candidateRouter = express.Router();

candidateRouter.post(
    '/',
    body().isObject(),
    body('CandidateID', 'must be a string').notEmpty(),
    body('ExamID', 'must be a string').notEmpty(),
    body('HashCode', 'must be a string').notEmpty(),

    async (req: Request, res: Response) => {
        return await createCandidate(req, res);
    }
);

candidateRouter.get('/:candidateId', async (req: Request, res: Response) => {
    return await getCandidate(req, res);
});

candidateRouter.get('/', async (req: Request, res: Response) => {
    return await getAllCandidates(req, res);
});
