import { Schema } from 'mongoose';
import { DB_SCHEMA } from '../../config/constants';
const ObjectId = Schema.Types.ObjectId;

const ChatSchema = new Schema({
    member_ids: [{ type: ObjectId, ref: DB_SCHEMA.USER, index: true }],
    messages: [{ type: ObjectId, ref: DB_SCHEMA.MESSAGE }],
});

const MessageSchema = new Schema({
    from: { type: ObjectId, ref: DB_SCHEMA.USER, required: true },
    to: { type: ObjectId, ref: DB_SCHEMA.USER, required: true },
    message: { type: String, default: '' },
    createdDate: { type: Number, required: true },
});
export { ChatSchema, MessageSchema };
