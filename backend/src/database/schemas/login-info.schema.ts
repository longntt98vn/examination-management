import { Schema } from 'mongoose';
import { DB_SCHEMA } from '../../config/constants';
import { BaseSchemaDefinition } from './base.schema';
import hash from 'sha256';

const ObjectId = Schema.Types.ObjectId;

export const LoginInfoSchema: Schema = new Schema({
    ...BaseSchemaDefinition,
    user: { type: ObjectId, ref: DB_SCHEMA.USER, required: true },
    username: { type: String, required: true },
    password: { type: String, set: hash, required: true },
    current_token: { type: String, required: true },
    current_socket_id: { type: String, default: null },
});
