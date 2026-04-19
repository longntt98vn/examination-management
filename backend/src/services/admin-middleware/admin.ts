import { RES_FORM } from '../../config/constants';
import { DBConnection } from '../../utils/db-connection';
import { Request, Response, NextFunction } from 'express';
import { UserSchema } from '../../database/schemas/user-schema';

/** Tiên quyết: validateToken  có senderInstance*/
export function validateAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.senderInstance?.role == 'admin') next();
    else {
        res.status(400);
        res.json(RES_FORM(400, 'Bạn không phải là admin'));
    }
}

export async function fGetAllUserInfo(req: Request, res: Response) {
    var users = await DBConnection.User?.find({});
    res.status(200);
    res.json(RES_FORM(200, 'Success', users));
}
