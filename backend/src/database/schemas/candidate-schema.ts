import { Schema } from 'mongoose';
import { BaseSchemaDefinition } from './base.schema';
import { CandidateStatus, DB_SCHEMA } from '../../config/constants';
import { ObjectId } from 'mongodb';

const CandidateSchema: Schema = new Schema({
    ...BaseSchemaDefinition,
    user: { type: ObjectId, ref: DB_SCHEMA.USER, required: true },
    exam: { type: ObjectId, ref: DB_SCHEMA.EXAM, required: true },
    score: { type: ObjectId, ref: DB_SCHEMA.SCORE, required: false },
    status: {
        type: Number,
        enum: CandidateStatus,
        default: CandidateStatus.PENDING,
    },
    hash: { type: String, required: false },
});

export default CandidateSchema;
