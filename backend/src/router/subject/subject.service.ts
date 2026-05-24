import { Request, Response } from 'express';
import { DBConnection } from '../../utils/db-connection';

export const checkSubjectExist = async (
    subjectId: string
): Promise<boolean> => {
    const subject = await DBConnection.Subject?.exists({ _id: subjectId });
    return subject ? true : false;
};

export const getAllSubjects = async (req: Request, res: Response) => {
    const subjects = await DBConnection.Subject?.find({});
    return res.status(200).json(subjects);
};
