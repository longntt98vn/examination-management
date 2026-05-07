import { Request, Response } from 'express';
import { RES_FORM } from '../../config/constants';

async function fAddSubject(req: Request, res: Response) {
    let subjectName = req.body.subject_name;
    let subjectCode = req.body.subject_code;
    let credits_number = req.body.credits_number;
    try {
        let newSubject = new global.DBConnection.Subject({
            subject_name: subjectName,
            subject_code: subjectCode,
            credits_number: credits_number,
        });
        await newSubject.save();
        res.status(200);
        res.json(
            RES_FORM(
                200,
                `Added ${subjectCode} -> ${subjectName} -> ${credits_number}`
            )
        );
    } catch (e: any) {
        if (e.code == 11000) {
            res.status(400);
            res.json(RES_FORM(400, 'Subject code or subject name existed'));
        } else {
            res.status(400);
            res.json(
                RES_FORM(
                    400,
                    'Unknown error. Maybe required field not found. Err message: ' +
                        e.toString()
                )
            );
        }
    }
}
export { fAddSubject };
