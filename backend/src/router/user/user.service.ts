import { Request, Response } from 'express';

export const getUsersByConditions = async (req: Request, res: Response) => {
    const { conditions } = req.body;
    const users = await global.DBConnection.User.find(conditions);
    return res.status(200).json(users);
};
