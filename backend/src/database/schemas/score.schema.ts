import { Schema } from 'mongoose';
import { DB_SCHEMA, ScoreStatus } from '../../config/constants';
import { BaseSchema } from './base.schema';

const ObjectId = Schema.Types.ObjectId;

export const ScoreSchema: Schema = new Schema({
    ...BaseSchema,
    exam_id: { type: ObjectId, ref: DB_SCHEMA.EXAM, required: true },
    student_id: { type: ObjectId, ref: DB_SCHEMA.USER, required: true },
    value: { type: Number, min: 0, max: 10, required: true },
    status: {
        type: Number,
        enum: ScoreStatus,
        default: ScoreStatus.NOT_SIGNED,
    },
});
