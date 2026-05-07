import { Model } from 'mongoose';

declare global {
    var DBConnection: {
        initiated: boolean;
        connection: any;
        LoginInfo: Model<any>;
        User: Model<any>;
        Class: Model<any>;
        Chat: Model<any>;
        Message: Model<any>;
        Subject: Model<any>;
        Score: Model<any>;
        ScoresTable: Model<any>;
        Post: Model<any>;
        Feed: Model<any>;
        Comment: Model<any>;
        Semester: Model<any>;
        Test: Model<any>;
        init(): Promise<void>;
        disconnect(): Promise<void>;
    };
    var IOConnection: {
        notifyNewPost(post: any, classId: string): void;
        notifyNewComment(comment: any, postId: string, classId: string): void;
        notifyUpdatePost(post: any, classId: string): void;
    };
}

export {};
