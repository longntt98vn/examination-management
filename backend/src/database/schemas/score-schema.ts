import { Schema } from 'mongoose';
import { DB_SCHEMA } from '../../config/constants';

const ObjectId = Schema.Types.ObjectId;
const ScoreSchema: Schema = new Schema({
    score: { type: Number, min: 0, max: 10, required: true },
    subject: { type: ObjectId, ref: DB_SCHEMA.SUBJECT, required: true },
    semester_id: { type: ObjectId, ref: DB_SCHEMA.SEMESTER, required: true },
});
const ScoresTableSchema: Schema = new Schema({
    user_ref: { type: ObjectId, ref: DB_SCHEMA.USER, required: true },
    scores: [{ type: [ObjectId], ref: DB_SCHEMA.SCORE, default: [] }],
    status: [{ type: [String], default: [] }],
});
export { ScoreSchema, ScoresTableSchema };
