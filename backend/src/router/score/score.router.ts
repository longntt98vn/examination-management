import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { ScoreStatus } from '../../config/constants';
import { validateToken } from '../../services/auth-middleware/auth';
import { handleValidationErrors } from '../../utils';
import {
    getAllScoresOnChain,
    getScoreByConditions,
    getScoreHistory,
    updateScores,
} from './score.service';

export const scoreRouter = express.Router();

scoreRouter.post(
    '/',
    validateToken,
    body().isArray(),
    body('*.candidateId', 'must be a string').notEmpty(),
    body('*.value', 'must be a number').isFloat({ min: 0, max: 10 }),
    body('*.status', 'must be a number')
        .isIn([
            ScoreStatus.NOT_SIGNED,
            ScoreStatus.TEACHER_SIGNED,
            ScoreStatus.ADMIN_SIGNED,
        ])
        .optional(),
    handleValidationErrors,
    async (req: Request, res: Response) => {
        await updateScores(req, res);
    }
);

scoreRouter.get('/', async (req: Request, res: Response) => {
    if (req.query.getOnChain === 'true') {
        return await getAllScoresOnChain(req, res);
    }

    return await getScoreByConditions(req, res);
});

scoreRouter.get('/history', async (req: Request, res: Response) => {
    return await getScoreHistory(req, res);
});
