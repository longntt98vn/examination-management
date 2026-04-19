import { Document } from 'mongoose';

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
            };
            senderVNUId?: string;
            isAdmin?: boolean;
            authState?: string;
        }
    }
}
