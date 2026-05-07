import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { SECRET_KEY } from '../../config/constants';

interface AuthSocket extends Socket {
    senderVNUId?: string;
    loginInfo?: any;
}

type SocketMiddleware = (socket: AuthSocket, next: (err?: ExtendedError) => void) => void;

async function checkLoginInfo(socket: AuthSocket, next: (err?: ExtendedError) => void): Promise<void> {
    try {
        console.log("abc");
        const instance = await global.DBConnection.LoginInfo.findOne({user_ref : socket.senderVNUId})
        socket.loginInfo = instance;
        instance.current_socket_id = socket.id;
        await instance.save();
        if (!instance) {
            next(new Error("TokenInvalid"));
        }
        next();
    } catch(e) {
        next(e as Error);
    }
}

function checkTokenValid(socket: AuthSocket, next: (err?: ExtendedError) => void): void {
    try {
        console.log("abc");
        let decoded: any = null;
        if (socket.handshake.auth.token)
            decoded = jwt.verify(socket.handshake.auth.token, SECRET_KEY);
        if (socket.handshake.query.token)
            decoded = jwt.verify(socket.handshake.query.token as string, SECRET_KEY);
        if (socket.handshake.headers["x-auth-token"]) {
            decoded = jwt.verify(socket.handshake.headers["x-auth-token"] as string, SECRET_KEY);
        }
        socket.senderVNUId = decoded.id;
        next()
    } catch(e) {
        next(new Error(e instanceof Error ? e.message : String(e)))
    }
}

export { checkLoginInfo, checkTokenValid };