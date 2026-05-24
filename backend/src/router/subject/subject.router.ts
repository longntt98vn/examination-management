import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getAllSubjects } from './subject.service';

export const subjectRouter = express.Router();
const { OK } = StatusCodes;

subjectRouter.get('/', async (req: Request, res: Response) => {
    return res.status(OK).json(await getAllSubjects(req, res));
});
