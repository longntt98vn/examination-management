import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DBConnection } from '../../utils/db-connection';
import { AUTH_STATE, RES_FORM, SECRET_KEY } from '../../config/constants';
import jwt from 'jsonwebtoken';

/** Xác định trạng thái của token có hợp lệ chưa
    req.authState được truyền vào req cùng senderVNUId và senderInstance*/
export async function validateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let token = req.cookies.token;
    try {
        // var decoded = jwt.verify(token, Configs.SECRET_KEY);
        if (!token) throw Error('TokenNotFound');
        var instance = await DBConnection.LoginInfo?.findOne({
            current_token: token,
        }).populate('user_ref');
        // console.log(instance.user_ref.name);
        if (instance != null) {
            req.authState = AUTH_STATE.AUTHORIZED.toString();
            req.senderVNUId = instance.user_ref.vnu_id;
            req.isAdmin = instance.user_ref.role == 'admin';
            req.senderInstance = instance.user_ref;
            if (req.senderInstance == null) throw Error('UserNotFound');
            next();
        } else {
            req.authState = AUTH_STATE.INVALID_AUTHORIZED.toString();
            // req.token = token;
            // next();
            throw Error('TokenInvalid');
        }
    } catch (err) {
        if ((err as Error).name == 'TokenExpiredError') {
            res.status(410);
            res.send(
                RES_FORM(400, 'Error', {
                    name: 'TokenExpiredError',
                    description: '',
                })
            );
            return;
        } else if ((err as Error).name == 'JsonWebTokenError') {
            res.status(400);
            res.send(
                RES_FORM(400, 'Error', {
                    name: (err as Error).name,
                    description: (err as Error).message,
                })
            );
            res.send(`${(err as Error).name} : ${(err as Error).message}`);
            return;
        } else if ((err as Error).name == 'TokenNotFound') {
            res.status(404);
            res.send(
                RES_FORM(400, 'Error', {
                    name: (err as Error).name,
                    description: '',
                })
            );
            return;
        } else if ((err as Error).name == 'UserNotFound') {
            res.status(400);
            res.send(
                RES_FORM(400, 'Error', {
                    name: (err as Error).name,
                    description: '',
                })
            );
            return;
        } else {
            res.status(400);
            res.send(
                RES_FORM(400, 'Error', {
                    name: 'UnknownError',
                    description: (err as Error).toString(),
                })
            );
            return;
        }
    }
}

/**
 * Call After validate token (have isAdmin ?)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function checkIsAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.isAdmin) {
        next();
    } else {
        res.status(400);
        res.json(
            RES_FORM(
                400,
                'Cần quyền của quản trị viên để thực hiện thao tác này'
            )
        );
    }
}

export function validateLoginArgument(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const rUsername = req.body.username;
    const rPassword = req.body.password;
    if (rPassword && rUsername) {
        next();
    } else {
        res.status(400);

        res.json(RES_FORM(400, 'Username and password must be filled'));
    }
}

export async function login(req: Request, res: Response) {
    const rUsername = req.body.username;
    const rPassword = req.body.password;

    let userRef = await DBConnection.User?.findOne({ vnu_id: rUsername });
    if (!userRef) {
        res.status(400);
        res.json(RES_FORM(400, 'Username hoặc Password chưa đúng'));
        return;
    }

    try {
        const instance = await DBConnection.LoginInfo?.findOne({
            user_ref: userRef._id,
        });

        console.log(instance);

        if (instance != null) {
            let newToken = jwt.sign(
                {
                    id: instance.user_ref.toString(),
                    createdDate: new Date().getTime(),
                },
                SECRET_KEY,
                { expiresIn: '2 days' }
            );
            instance.current_token = newToken;
            await instance.save();
            res.status(200);
            res.json(RES_FORM(200, 'Logged In Success', { token: newToken }));
        } else {
            res.status(400);
            res.json(RES_FORM(400, 'Username hoặc Password chưa đúng'));
        }
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json(RES_FORM(500, 'Internal server error'));
    }
}
export async function fForgetPassword(req: Request, res: Response) {
    var email = req.body.email;
    var email_owner = await DBConnection.User?.findOne({ email: email });
    if (!email_owner) {
        res.status(404);
        res.json(RES_FORM(404, 'Email không tồn tại trong hệ thống'));
        return;
    }
    // var transporter = nodemailer.createTransport(
    //     smtpTransport({
    //         service: 'gmail',
    //         host: 'smtp.gmail.com',
    //         auth: {
    //             user: 'vakoyomi@gmail.com',
    //             pass: 'Vietanh0911cc',
    //         },
    //     })
    // );

    var newPassword = uuidv4();
    var mailOptions = {
        from: 'vakoyomi@gmail.com',
        to: email,
        subject: 'Website cố vấn học tập',
        text: 'Password mới của bạn là:' + newPassword,
    };
    let temp = await DBConnection.LoginInfo?.findOneAndUpdate(
        { user_ref: email_owner._id },
        { password: newPassword },
        {
            new: true,
        }
    );
    if (!temp) {
        res.status(404);
        res.json(RES_FORM(404, 'Có lỗi xảy ra'));
        return;
    }
    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //         res.status(404);
    //         res.json(RES_FORM(404, 'Có lỗi xảy ra'));
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //         res.status(200);
    //         res.json(RES_FORM(200, 'Khôi phục thành công'));
    //     }
    // });
}
