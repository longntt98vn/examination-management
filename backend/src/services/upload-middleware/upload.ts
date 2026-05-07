import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import csv from 'csvtojson/v2';
import { register } from '../auth-middleware/register';
import { RES_FORM } from '../../config/constants';
import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';

import { fAddSubject } from '../subject-middleware/subject';

/** Must call  handleUploadFile before*/
function fHandleUploadFile(req: Request, res: Response) {
    res.status(200);
    res.json(
        RES_FORM(200, 'Success', { link: '/public/data/' + req.fileName })
    );
}
/** Support upload file to public/data */
function handleUploadFile(req: Request, res: Response, next: NextFunction) {
    let sampleFile: UploadedFile;
    let uploadPath: string;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.file as UploadedFile;
    var fileNameParts = sampleFile.name.split('.');
    var ext = '.';
    let fileName: string;
    if (fileNameParts.length > 0) {
        console.log(fileNameParts);
        ext += fileNameParts[fileNameParts.length - 1];
        fileName = uuidv4() + ext;
    } else fileName = uuidv4();

    uploadPath = path.resolve(__dirname, '..', '..', 'public', 'data');
    console.log(uploadPath);
    uploadPath = uploadPath + '/' + fileName;
    console.log(uploadPath);
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err: any) {
        if (err) return res.status(500).send(err);
        req.fileUploadPath = uploadPath;
        req.fileName = fileName;
        next();
    });
}

/** Must call  handleUploadFile before*/
async function fHandleUploadDSCV(req: Request, res: Response) {
    let success: any[] = [];
    let fail: any[] = [];
    const jsonArray = await csv().fromFile(req.fileUploadPath!);
    // let res = await global.DBConnection.Test.insertMany(jsonArray, { ordered: false })
    interface FakeResType {
        statusCode: number | null;
        responseJson: any;
        json: (obj: any) => void;
        status: (status: number) => void;
    }

    class fakeRes implements FakeResType {
        statusCode: number | null = null;
        responseJson: any = null;
        json = (obj: any): void => {
            this.responseJson = obj;
        };
        status = (status: number): void => {
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
        i.role = 'teacher';
        var fakeReqInstance = new fakeReq(i);
        var fakeResInstance = new fakeRes();
        await register(fakeReqInstance as any, fakeResInstance as any);
        if (fakeResInstance.statusCode != 200) {
            if (
                fakeResInstance.responseJson &&
                fakeResInstance.responseJson.message
            )
                i.error = fakeResInstance.responseJson.message;
            fail.push(i);
        } else success.push(i);
    }
    res.status(200);
    res.json(RES_FORM(200, 'Success', { registered: success, failed: fail }));
}

/** Must call  handleUploadFile before*/
async function fHandleUploadDSSV(req: Request, res: Response) {
    let success: any[] = [];
    let fail: any[] = [];
    const jsonArray = await csv().fromFile(req.fileUploadPath!);
    // let res = await global.DBConnection.Test.insertMany(jsonArray, { ordered: false })
    interface FakeResType {
        statusCode: number | null;
        responseJson: any;
        json: (obj: any) => void;
        status: (status: number) => void;
    }

    class fakeRes implements FakeResType {
        statusCode: number | null = null;
        responseJson: any = null;
        json = (obj: any): void => {
            this.responseJson = obj;
        };
        status = (status: number): void => {
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
        i.role = 'student';
        var fakeReqInstance = new fakeReq(i);
        var fakeResInstance = new fakeRes();
        await register(fakeReqInstance as any, fakeResInstance as any);
        if (fakeResInstance.statusCode != 200) {
            if (
                fakeResInstance.responseJson &&
                fakeResInstance.responseJson.message
            )
                i.error = fakeResInstance.responseJson.message;
            fail.push(i);
        } else success.push(i);
    }
    res.status(200);
    res.json(RES_FORM(200, 'Success', { registered: success, failed: fail }));
}

/** Must call  handleUploadFile before*/
async function fHandleUploadDSMH(req: Request, res: Response) {
    let success: any[] = [];
    let fail: any[] = [];
    const jsonArray = await csv().fromFile(req.fileUploadPath!);
    // let res = await global.DBConnection.Test.insertMany(jsonArray, { ordered: false })
    interface FakeResType {
        statusCode: number | null;
        responseJson: any;
        json: (obj: any) => void;
        status: (status: number) => void;
    }

    class fakeRes implements FakeResType {
        statusCode: number | null = null;
        responseJson: any = null;
        json = (obj: any): void => {
            this.responseJson = obj;
        };
        status = (status: number): void => {
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
        var fakeReqInstance = new fakeReq(i);
        var fakeResInstance = new fakeRes();
        await fAddSubject(fakeReqInstance as any, fakeResInstance as any);
        if (fakeResInstance.statusCode != 200) {
            if (
                fakeResInstance.responseJson &&
                fakeResInstance.responseJson.message
            )
                i.error = fakeResInstance.responseJson.message;
            fail.push(i);
        } else success.push(i);
    }
    res.status(200);
    res.json(RES_FORM(200, 'Success', { registered: success, failed: fail }));
}
export {
    fHandleUploadFile,
    fHandleUploadDSCV,
    fHandleUploadDSMH,
    fHandleUploadDSSV,
    handleUploadFile,
};
