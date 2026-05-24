import { Request, Response } from 'express';
import { DBConnection } from '../../utils/db-connection';

export const checkSemesterExist = async (
    semesterId: string
): Promise<boolean> => {
    const semester = await DBConnection.Semester?.exists({ _id: semesterId });
    return semester ? true : false;
};

export const getAllSemesters = async (req: Request, res: Response) => {
    const semesters = await DBConnection.Semester?.find({});

    return res.status(200).json(semesters);
};
