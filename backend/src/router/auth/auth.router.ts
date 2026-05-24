import { body, validationResult } from 'express-validator';
import { login, validateToken } from '../../services/auth-middleware/auth';
import express, { Request, Response } from 'express';
import { RES_FORM } from '../../config/constants';

export const authRouter = express.Router();

authRouter.post(
    '/login',
    body().isObject(),
    body('username', 'must be a string').notEmpty(),
    body('password', 'must be a string').optional(),

    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        return await login(req, res);
    }
);

// get current user
authRouter.get(
    '/refresh-login',
    validateToken,
    async (req: Request, res: Response) => {
        return res
            .status(200)
            .json(RES_FORM(200, 'Success', req.senderInstance));
    }
);
