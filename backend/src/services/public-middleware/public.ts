import path from 'path';
import { Request, Response } from 'express';
function fGetPublicData(req: Request, res: Response) {
    const filename = Array.isArray(req.params.filename) 
        ? req.params.filename[0] 
        : req.params.filename;
    let filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'public',
        'data',
        filename
    );
    // res.status(200);
    res.download(filePath, function (err) {
        if (err) {
            // Handle error, but keep in mind the response may be partially-sent
            // so check res.headersSent
        } else {
            // decrement a download credit, etc.
        }
    });
}

export { fGetPublicData };
