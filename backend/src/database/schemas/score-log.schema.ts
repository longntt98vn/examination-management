import { Schema } from 'mongoose';
import { DB_SCHEMA, ScoreStatus } from '../../config/constants';
import { BaseSchema } from './base.schema';

const ObjectId = Schema.Types.ObjectId;

export const ScoreLogSchema: Schema = new Schema({
    ...BaseSchema,
    score_id: { type: ObjectId, ref: DB_SCHEMA.SCORE, required: true },
    user_ref: { type: ObjectId, ref: DB_SCHEMA.USER, required: true },
    score_before: { type: Number, min: 0, max: 10 },
    score_after: { type: Number, min: 0, max: 10 },
    status_before: {
        type: Number,
        enum: ScoreStatus,
    },
    status_after: {
        type: Number,
        enum: ScoreStatus,
    },
});
