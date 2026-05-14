import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { createExam, getExamById, getExams } from './exam.service';

export const examRouter = express.Router();
const { OK } = StatusCodes;

examRouter.post(
    '/',
    body().isObject(),
    body('ExamID', 'must be a string').notEmpty(),
    body('HashCode', 'must be a string').notEmpty(),

    async (req: Request, res: Response) => {
        await createExam(req, res);
    }
);

examRouter.get('/:examId', async (req: Request, res: Response) => {
    return res.status(OK).json(await getExamById(req, res));
});

examRouter.get('/', async (req: Request, res: Response) => {
    return res.status(OK).json(await getExams(req, res));
});
