import { Schema } from 'mongoose';
import { BaseSchema } from './base.schema';
import { toLower } from '../../utils';
import { UserRole } from '../../config/constants';

export const UserSchema: Schema = new Schema({
    ...BaseSchema,
    name: { type: String },
    role: {
        type: Number,
        enum: {
            values: [UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN],
            message: 'Role {VALUE} is not supported',
        },
        require: true,
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female'],
            message: 'Gender {VALUE} is not supported',
        },
        require: true,
    },
    phone_number: {
        type: String,
        required: false,
        default: 'Chưa có số điện thoại',
    },
    parent_number: {
        type: String,
        required: false,
        default: 'Chưa có số điện thoại phụ huynh',
    },
    location: { type: String, default: 'Ha Noi' },
    date_of_birth: { type: Number, default: new Date().getTime() },
    email: { type: String, set: toLower },
});
