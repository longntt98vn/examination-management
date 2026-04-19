import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { createScore, getAllScores, getScore } from '../services/score.service';

export const scoreRouter = express.Router();

scoreRouter.post(
    '/',
    body().isObject(),
    body('ScoreID', 'must be a string').notEmpty(),
    body('CandidateID', 'must be a string').notEmpty(),
    body('HashCode', 'must be a string').notEmpty(),

    async (req: Request, res: Response) => {
        return await createScore(req, res);
    }
);

scoreRouter.get('/:scoreId', async (req: Request, res: Response) => {
    return await getScore(req, res);
});

scoreRouter.get('/', async (req: Request, res: Response) => {
    return await getAllScores(req, res);
});
