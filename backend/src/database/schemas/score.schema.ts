import { Schema } from 'mongoose';
import { DB_SCHEMA, ScoreStatus } from '../../config/constants';
import { BaseSchemaDefinition } from './base.schema';

const ObjectId = Schema.Types.ObjectId;

export const ScoreSchema: Schema = new Schema({
    ...BaseSchemaDefinition,
    candidate: { type: ObjectId, ref: DB_SCHEMA.CANDIDATE, required: true },
    value: { type: Number, min: 0, max: 10, required: true },
    status: {
        type: Number,
        enum: ScoreStatus,
        default: ScoreStatus.NOT_SIGNED,
    },
    hash: { type: String, required: false },
});
