import { Request, Response } from 'express';
import { RES_FORM } from '../../config/constants';
import csv from 'csvtojson/v2';

async function fAddSemester(req: Request, res: Response) {
    let semesterName = req.body.semester_name;
    let semesterCode = req.body.semester_id;
    try {
        let newSubject = new global.DBConnection.Semester({
            semester_name: semesterName,
            semester_id: semesterCode,
        });
        await newSubject.save();
        res.status(200);
        res.json(
            RES_FORM(200, `Đã thêm kỳ học ${semesterCode}: ${semesterName}`)
        );
    } catch (e: any) {
        if (e.code == 11000) {
            res.status(400);
            res.json(RES_FORM(400, 'Mã kỳ học đã tồn tại'));
        } else {
            res.status(400);
            res.json(RES_FORM(400, 'Lỗi không xác định. Lỗi: ' + e.toString()));
        }
    }
}
async function fGetSemester(req: Request, res: Response) {
    let semester_id = req.params.semesterId;
    let semesterInstance = await global.DBConnection.Semester.findOne({
        semester_id: semester_id,
    });
    if (semesterInstance) {
        res.status(200);
        res.json(RES_FORM(200, undefined, semesterInstance));
    } else {
        res.status(404);
        res.json(RES_FORM(404, 'Mã kỳ học không tồn tại'));
    }
}

async function fGetAllSemester(req: Request, res: Response) {
    let semester_id = req.params.semesterId;
    let semesterInstance = await global.DBConnection.Semester.find({});
    if (semesterInstance) {
        res.status(200);
        res.json(RES_FORM(200, undefined, semesterInstance));
    } else {
        res.status(404);
        res.json(RES_FORM(404, 'Mã kỳ học không tồn tại'));
    }
}

/** Handle upload file first */
async function fHandleUploadSemester(req: Request, res: Response) {
    let success: any[] = [];
    let fail: any[] = [];
    const jsonArray = await csv().fromFile(req.fileUploadPath!);

    interface FakeResJson {
        status?: number;
        message?: string;
        data?: any;
    }

    class fakeRes {
        statusCode: number | null = null;
        responseJson: FakeResJson | null = null;
        json = (obj: FakeResJson) => {
            this.responseJson = obj;
        };
        status = (status: number) => {
            this.statusCode = status;
        };
    }

    class fakeReq {
        body: any = null;
        constructor(body: any) {
            this.body = body;
        }
    }

    for (var i of jsonArray) {
        var fakeReqInstance = new fakeReq(i) as any;
        var fakeResInstance = new fakeRes() as any;
        await fAddSemester(fakeReqInstance, fakeResInstance);
        if (fakeResInstance.statusCode != 200) {
            if (
                fakeResInstance.responseJson &&
                fakeResInstance.responseJson.message
            )
                (i as any).error = fakeResInstance.responseJson.message;
            fail.push(i);
        } else {
            if (fakeResInstance.responseJson)
                (i as any).response = fakeResInstance.responseJson.message;
            success.push(i);
        }
    }
    res.status(200);
    res.json(RES_FORM(200, undefined, { registered: success, failed: fail }));
}

export { fAddSemester, fGetSemester, fHandleUploadSemester, fGetAllSemester };
