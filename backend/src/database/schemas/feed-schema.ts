import { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;
import { DB_SCHEMA } from '../../config/constants';
const FeedSchema: Schema = new Schema({
    class_ref: {
        type: ObjectId,
        index: { unique: true },
        required: true,
        ref: DB_SCHEMA.CLASS,
    },
    posts: [{ type: [ObjectId], ref: DB_SCHEMA.POST, default: [] }],
});

const PostSchema: Schema = new Schema({
    from: { type: ObjectId, required: true, ref: DB_SCHEMA.USER },
    content: { type: String, default: 'Posted' },
    comments: [{ type: [ObjectId], ref: DB_SCHEMA.COMMENT, default: [] }],
    created_date: { type: Number, default: new Date().getTime() },
    liked: [{ type: [ObjectId], ref: DB_SCHEMA.USER, default: [] }],
});

const CommentSchema: Schema = new Schema({
    from: { type: ObjectId, required: true, ref: DB_SCHEMA.USER },
    content: { type: String, default: 'Commented' },
    created_date: { type: Number, default: new Date().getTime() },
});
export { FeedSchema, PostSchema, CommentSchema };
