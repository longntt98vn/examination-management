import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { RES_FORM } from '../../config/constants';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import { handleChatMessage } from './HandleChatMessage';
import { checkLoginInfo, checkTokenValid } from './IOAuthentication';
import {
    notifyNewPost,
    notifyNewComment,
    notifyUpdatePost,
} from './HandleNotification';

interface AuthSocket extends Socket {
    loginInfo?: any;
}

class IOConnection {
    io: Server;
    handleChatMessage: typeof handleChatMessage;
    notifyNewPost: (post: any, classId: string) => void;
    notifyNewComment: (
        newComment: any,
        postId: string,
        classId: string
    ) => void;
    notifyUpdatePost: (newPost: any, classId: string) => void;

    constructor(server: HTTPServer) {
        this.handleChatMessage = handleChatMessage;
        this.notifyNewPost = notifyNewPost.bind(this);
        this.notifyNewComment = notifyNewComment.bind(this);
        this.notifyUpdatePost = notifyUpdatePost.bind(this);
        this.io = new Server(server, {
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST'],
            },
        });
        this.io.use(checkTokenValid);
        this.io.use(checkLoginInfo);
        this.io.on('connection', async (socket: AuthSocket) => {
            await handleNewConnection(socket);
            socket.loginInfo.populate('user_ref');
            console.log(`New connection, ID[${socket.id}]`);
            socket.on('NewMessage', this.handleChatMessage.bind(this, socket));
            socket.on('disconnect', () => {
                console.log(`ID[${socket.id}] closed connection`);
                socket.loginInfo.current_socket_id = null;
                try {
                    socket.loginInfo.save();
                } catch (e) {
                    console.log('Reset ID socket in DB error');
                }
            });
        });
        global.IOConnection = this;
    }
}

const handleNewConnection = async (socket: AuthSocket) => {
    const sender = await global.DBConnection.User.findOne({
        _id: socket.loginInfo.user_ref,
    });
    if (!sender) return;
    if (sender.role == 'teacher') {
        const classes = await global.DBConnection.Class.find({
            class_teacher: sender._id,
        });
        for (const i of classes) {
            socket.join(i.class_id);
        }
    } else if (sender.role == 'student') {
        const classes = await global.DBConnection.Class.find({
            class_members: sender._id,
        });
        for (const i of classes) {
            socket.join(i.class_id);
        }
    }
};

export default IOConnection;
