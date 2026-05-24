import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const { BAD_REQUEST } = StatusCodes;

export function updateInstance(instance: any, update: any) {
    for (const [key, value] of Object.entries(instance)) {
        instance[key] = update[key] ? update[key] : value;
    }
    return instance;
}

export function toLower(v: string) {
    return v.toLowerCase();
}

export const handleValidationErrors = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
};
