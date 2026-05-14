import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { ScoreStatus } from '../../config/constants';
import { updateScores } from './score.service';

export const scoreRouter = express.Router();

scoreRouter.post(
    '/',
    body().isObject(),
    body('ExamID', 'must be a string').notEmpty(),
    body('Scores', 'must be an array').isArray(),
    body('Scores.*.Value', 'must be a number').isFloat({ min: 0, max: 10 }),
    body('Scores.*.Status', 'must be a number').isIn([
        ScoreStatus.NOT_SIGNED,
        ScoreStatus.TEACHER_SIGNED,
        ScoreStatus.ADMIN_SIGNED,
    ]),

    async (req: Request, res: Response) => {
        await updateScores(req, res);
    }
);
