import { Request, Response } from 'express';
import { DBConnection } from '../../utils/db-connection';

export const getUsersByConditions = async (req: Request, res: Response) => {
    const { role } = req.query;

    const users = await DBConnection.User?.find({
        ...(Number(role) && { role: Number(role) }),
    });

    return res.status(200).json(users);
};

export const checkUserExist = async (userId: string): Promise<boolean> => {
    const user = await DBConnection.User?.exists({ _id: userId });

    return user ? true : false;
};
