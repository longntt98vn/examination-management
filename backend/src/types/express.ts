import { Document, Model } from 'mongoose';
import { UploadedFile } from 'express-fileupload';

declare global {
    namespace Express {
        interface Request {
            senderInstance?: Document & {
                name?: string;
                role?: 'student' | 'teacher' | 'admin';
                gender?: 'male' | 'female';
                phone_number?: string;
                parent_number?: string;
                location?: string;
                date_of_birth?: number;
                email?: string;
                vnu_id?: string;
                _id?: any;
            };
            senderVNUId?: string;
            isAdmin?: boolean;
            authState?: string;
            classInstance?: any;
            feedInstance?: any;
            postInstance?: any;
            files?: {
                [key: string]: UploadedFile | UploadedFile[];
            } | null;
            fileUploadPath?: string;
            fileName?: string;
        }
    }
}
