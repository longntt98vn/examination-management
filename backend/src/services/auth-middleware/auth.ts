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
    let token = req.headers['token'];
    try {
        // var decoded = jwt.verify(token, Configs.SECRET_KEY);
        if (!token) throw Error('TokenNotFound');
        var instance = await DBConnection.LoginInfo?.findOne({
            current_token: token,
        }).populate('user');
        // console.log(instance.user_ref.name);
        if (instance != null && instance.user != null) {
            req.authState = AUTH_STATE.AUTHORIZED.toString();
            req.senderInstance = instance.user;
            next();
        } else {
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
    const userRef = await DBConnection.User?.findOne({ username: rUsername });
    if (!userRef) {
        res.status(400);
        res.json(RES_FORM(400, 'Username hoặc Password chưa đúng'));
        return;
    }
    try {
        const token = jwt.sign(
            {
                id: userRef._id.toString(),
                createdDate: new Date().getTime(),
            },
            SECRET_KEY,
            { expiresIn: '2 days' }
        );
        // TẠO SESSION MỚI thay vì update session cũ
        await DBConnection.LoginInfo?.create({
            user: userRef._id, // Không còn unique constraint
            username: rUsername,
            password: '',
            current_token: token,
            current_socket_id: null,
        });
        res.status(200);
        res.json(RES_FORM(200, 'Logged In Success', { token: token }));
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
