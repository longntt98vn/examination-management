import { Schema } from 'mongoose';
import { DB_SCHEMA, ScoreStatus } from '../../config/constants';
import { BaseSchemaDefinition } from './base.schema';

const ObjectId = Schema.Types.ObjectId;

export const ScoreLogSchema: Schema = new Schema({
    ...BaseSchemaDefinition,
    score: { type: ObjectId, ref: DB_SCHEMA.SCORE, required: true },
    user: { type: ObjectId, ref: DB_SCHEMA.USER, required: true },
    value_before: { type: Number, min: 0, max: 10, required: true },
    value_after: { type: Number, min: 0, max: 10, required: true },
    status_before: { type: Number, enum: ScoreStatus, required: true },
    status_after: { type: Number, enum: ScoreStatus, required: true },
});
