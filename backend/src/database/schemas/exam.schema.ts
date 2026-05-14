import { Schema } from 'mongoose';
import { DB_SCHEMA } from '../../config/constants';
import { BaseSchema } from './base.schema';
const ObjectId = Schema.Types.ObjectId;

export const ExamSchema: Schema = new Schema({
    ...BaseSchema,
    semester_ref: { type: ObjectId, ref: DB_SCHEMA.SEMESTER, required: true },
    subject_ref: { type: ObjectId, ref: DB_SCHEMA.SUBJECT, required: true },
    student_refs: { type: [ObjectId], ref: DB_SCHEMA.USER, required: true },
});
