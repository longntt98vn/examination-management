import { Server } from 'socket.io';

export function notifyNewPost(
    this: { io: Server },
    post: any,
    classId: string
) {
    this.io.to(classId).emit('NewPost', post);
}

export function notifyNewComment(
    this: { io: Server },
    newComment: any,
    postId: string,
    classId: string
) {
    this.io
        .to(classId)
        .emit('NewComment', { new_comment: newComment, postId: postId });
}

export function notifyUpdatePost(
    this: { io: Server },
    newPost: any,
    classId: string
) {
    this.io.to(classId).emit('UpdatePost', newPost);
}
