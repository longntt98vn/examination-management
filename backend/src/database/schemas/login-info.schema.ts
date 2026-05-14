import { Schema } from 'mongoose';
import { DB_SCHEMA } from '../../config/constants';
import { BaseSchema } from './base.schema';
import hash from 'sha256';

const ObjectId = Schema.Types.ObjectId;

export const LoginInfoSchema: Schema = new Schema({
    ...BaseSchema,
    user_ref: { type: ObjectId, unique: true, ref: DB_SCHEMA.USER },
    username: { type: String },
    password: { type: String, set: hash },
    current_token: { type: String, unique: true },
    current_socket_id: { type: String, default: null },
});
