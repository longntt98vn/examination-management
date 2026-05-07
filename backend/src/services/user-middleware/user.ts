import { NextFunction, Request, Response } from 'express';
import sha256 from 'sha256';
import { RES_FORM } from '../../config/constants';

async function getProfileById(req: Request, res: Response) {
    if (req.params.profileId == 'me') {
        const final = req.senderInstance;
        res.status(200);
        res.json(RES_FORM(200, 'Success', final));
        return;
    }
    try {
        const instance = await global.DBConnection.User.findOne({
            vnu_id: req.params.profileId,
        }).lean();

        if (instance) {
            res.status(200);
            res.json(instance);
        } else {
            res.status(404);
            res.json(RES_FORM(404, 'NotFound', 'User not found'));
        }
    } catch (err) {
        res.status(400);
        res.json(RES_FORM(400, 'Internal Error', err?.toString()));
    }
}

function validateEditProfileArgument(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // let user = new global.DBConnection.User(req.body);
    // let err = user.validateSync();
    //ignore role when edit profile
    // delete err.errors['role'];
    // res.json(JSON.stringify(err.errors));
    next();
}

async function editProfileById(req: Request, res: Response) {
    const old_password = req.body.old_password;
    const new_password = req.body.new_password;
    let senderLoginInfor;
    if (req.body.new_password && req.body.old_password) {
        senderLoginInfor = await global.DBConnection.LoginInfo.findOne({
            user_ref: req.senderInstance?._id,
        });
        if (new_password.length < 8) {
            res.status(400);
            res.json(
                RES_FORM(400, 'Error', 'Password mới chưa đủ độ dài (8 ký tự)')
            );
            return;
        }
        if (sha256(old_password) != senderLoginInfor.password) {
            res.status(400);
            res.json(
                RES_FORM(400, 'Error', 'Password cũ và mới không trùng nhau')
            );
            return;
        }
        senderLoginInfor.password = new_password;
        await senderLoginInfor.save();
    }
    if (req.params.profileId == 'me') {
        req.params.profileId = req.senderVNUId || '';
        try {
            // var final = await global.DBConnection.User.updateOne({_id :req.senderInstance._id},req.body, {new: true, runValidators: true,context: 'query'})
            await req.senderInstance?.$set(req.body);
            const final = await req.senderInstance?.save();
            res.status(200);
            res.json(RES_FORM(200, 'Success', final));
            return;
        } catch (e) {
            console.log('Co loi xay ra khi update profile');
            res.status(400);
            res.json(RES_FORM(400, 'Error', JSON.stringify(e)));
            return;
        }
    }

    try {
        const instance = await global.DBConnection.User.findOneAndUpdate(
            { vnu_id: req.params.profileId },
            req.body,
            { new: true, runValidators: true, context: 'query' }
        );

        if (instance) {
            res.status(200);
            res.json(RES_FORM(200, 'Success', instance));
            return;
        } else {
            res.status(404);
            res.json(RES_FORM(404, 'NotFound', 'User not found'));
            return;
        }
    } catch (err) {
        res.status(400);
        res.json(RES_FORM(400, 'Internal Error', err?.toString()));
        return;
    }
}

export { editProfileById, getProfileById, validateEditProfileArgument };
