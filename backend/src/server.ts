import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import passport from 'passport';
import pinoMiddleware from 'pino-http';
import { assetsRouter } from './router/assets.router';
import { authRouter } from './router/auth/auth.router';
import { candidateRouter } from './router/candidate.router';
import { examRouter } from './router/exam/exam.router';
import { healthRouter } from './router/health.router';
import { jobsRouter } from './router/jobs.router';
import { scoreRouter } from './router/score/score.router';
import { semesterRouter } from './router/semester/semester.router';
import { subjectRouter } from './router/subject/subject.router';
import { transactionsRouter } from './router/transactions.router';
import { userRouter } from './router/user/user.router';
import { authenticateApiKey, fabricAPIKeyStrategy } from './utils/auth';
import { logger } from './utils/logger';

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = StatusCodes;

export const createServer = async (): Promise<Application> => {
    const app = express();

    app.use(
        pinoMiddleware({
            logger,
            customLogLevel: function customLogLevel(res, err) {
                if (
                    res.statusCode >= BAD_REQUEST &&
                    res.statusCode < INTERNAL_SERVER_ERROR
                ) {
                    return 'warn';
                }

                if (res.statusCode >= INTERNAL_SERVER_ERROR || err) {
                    return 'error';
                }

                return 'debug';
            },
        })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // define passport startegy
    passport.use(fabricAPIKeyStrategy);

    // initialize passport js
    app.use(passport.initialize());

    if (process.env.NODE_ENV === 'production') {
        app.use(helmet());
    } else {
        app.use(
            cors({
                origin: [
                    'http://localhost:3123',
                    'http://localhost:3001',
                    'http://localhost:3000',
                ],
                credentials: true,
            })
        );
    }

    if (process.env.NODE_ENV === 'test') {
        // TBC
    }

    app.use('/', healthRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api/assets', authenticateApiKey, assetsRouter);
    app.use('/api/jobs', authenticateApiKey, jobsRouter);
    app.use('/api/transactions', authenticateApiKey, transactionsRouter);
    app.use('/api/candidate', authenticateApiKey, candidateRouter);
    app.use('/api/score', authenticateApiKey, scoreRouter);
    app.use('/api/exam', authenticateApiKey, examRouter);
    app.use('/api/semester', authenticateApiKey, semesterRouter);
    app.use('/api/subject', authenticateApiKey, subjectRouter);

    // For everything else
    app.use((_req, res) =>
        res.status(NOT_FOUND).json({
            status: getReasonPhrase(NOT_FOUND),
            timestamp: new Date().toISOString(),
        })
    );

    // Print API errors
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        logger.error(err);
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    });

    return app;
};
