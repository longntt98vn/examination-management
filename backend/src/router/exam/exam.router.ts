import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import {
    createExam,
    getExamsOnChain,
    getExamById,
    getExamInfoOnChain,
    getExams,
    updateExam,
} from './exam.service';
import { handleValidationErrors } from '../../utils';

export const examRouter = express.Router();
const { OK } = StatusCodes;

examRouter.post(
    '/',
    body().isObject(),
    body('examId', 'must be a string').notEmpty().optional(),
    body('semesterId', 'must be a string').notEmpty(),
    body('subjectId', 'must be a string').notEmpty(),
    body('candidateIds', 'must be an array').isArray(),
    body('teacherId', 'must be a string').notEmpty(),
    body('name', 'must be a string').notEmpty(),
    body('examDate', 'must be a date').notEmpty(),
    body('roomNumber', 'must be a string').notEmpty(),
    handleValidationErrors,
    async (req: Request, res: Response) => {
        if (req.body.examId) {
            await updateExam(req, res);
        } else {
            await createExam(req, res);
        }
    }
);

examRouter.get('/:examId', async (req: Request, res: Response) => {
    if (req.query.getOnChain === 'true') {
        return res.status(OK).json(await getExamInfoOnChain(req, res));
    }

    return res.status(OK).json(await getExamById(req, res));
});

examRouter.get('/', async (req: Request, res: Response) => {
    if (req.query.getOnChain === 'true') {
        return res.status(OK).json(await getExamsOnChain(req, res));
    }

    return res.status(OK).json(await getExams(req, res));
});
