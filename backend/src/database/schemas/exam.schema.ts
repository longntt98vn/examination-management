import { Schema } from 'mongoose';
import { DB_SCHEMA } from '../../config/constants';
import { BaseSchemaDefinition } from './base.schema';
const ObjectId = Schema.Types.ObjectId;

export const ExamSchema: Schema = new Schema({
    ...BaseSchemaDefinition,
    semester: { type: ObjectId, ref: DB_SCHEMA.SEMESTER, required: true },
    subject: { type: ObjectId, ref: DB_SCHEMA.SUBJECT, required: true },
    teacher: { type: ObjectId, ref: DB_SCHEMA.USER, required: true },
    name: { type: String, required: true },
    exam_date: { type: Date, required: true },
    room_number: { type: String, required: true },
    hash: { type: String, required: false },
});
