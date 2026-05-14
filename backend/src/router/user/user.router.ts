import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    createCandidate,
    getCandidate
} from '../../services/candidate.service';
import { getUsersByConditions } from './user.service';

export const userRouter = express.Router();

userRouter.post(
    '/',
    body().isObject(),
    body('CandidateID', 'must be a string').notEmpty(),
    body('ExamID', 'must be a string').notEmpty(),
    body('HashCode', 'must be a string').notEmpty(),

    async (req: Request, res: Response) => {
        return await createCandidate(req, res);
    }
);

userRouter.get('/:candidateId', async (req: Request, res: Response) => {
    return await getCandidate(req, res);
});

userRouter.get('/', async (req: Request, res: Response) => {
    return await getUsersByConditions(req, res);
});
