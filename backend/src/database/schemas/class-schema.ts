import { Schema } from 'mongoose';
import { DB_SCHEMA } from '../../config/constants';

const ObjectId = Schema.Types.ObjectId;

export const ClassSchema: Schema = new Schema({
    class_id: {
        type: String,
        index: { unique: true },
        dropDups: true,
        required: true,
    },
    class_name: { type: String, required: true },
    class_teacher: {
        type: ObjectId,
        required: true,
        ref: DB_SCHEMA.USER,
    },
    class_members: {
        type: [ObjectId],
        ref: DB_SCHEMA.USER,
        default: [],
    },
    feed_ref: { type: ObjectId, ref: DB_SCHEMA.FEED, default: null },
});
