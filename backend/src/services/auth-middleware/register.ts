import { DBConnection } from '../../utils/db-connection';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { RES_FORM, SECRET_KEY } from '../../config/constants';
const ObjectId = mongoose.Schema.Types.ObjectId;

export async function register(req: Request, res: Response) {
    let dupVNUId = await DBConnection.User?.findOne({
        vnu_id: req.body.vnu_id,
    });

    if (dupVNUId) {
        res.status(409);
        res.json(RES_FORM(400, 'VNU-ID is already registered by someone'));
    } else {
        try {
            let newUserLoginInfo = new mongoose.models.User({
                vnu_id: req.body.vnu_id ? req.body.vnu_id : uuidv4(),
                name: req.body.name,
                gender: req.body.gender,
                phone_number: req.body.phone_number,
                role: req.body.role,
                email: req.body.email,
                location: req.body.location,
                date_of_birth: req.body.dateOfBirth,
            });
            newUserLoginInfo = await newUserLoginInfo.save();
            let newToken = jwt.sign(
                {
                    vnu_id: newUserLoginInfo.vnu_id,
                    createdDate: new Date().getTime(),
                },
                SECRET_KEY,
                { expiresIn: 3600 }
            );
            // console.log("new token: ", newToken);
            let loginInfo = new mongoose.models.LoginInfo({
                user_ref: new ObjectId(newUserLoginInfo._id),
                password: req.body.password,
                current_token: newToken,
                current_socket_id: null,
            });

            await loginInfo.save();
            res.status(200);
            res.json(
                RES_FORM(200, 'Success', { token: loginInfo.current_token })
            );
        } catch (e) {
            res.status(400);

            res.json(RES_FORM(400, 'Error', (e as Error).message));
            return;
        }
    }
}
