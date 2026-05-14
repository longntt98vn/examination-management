import { Schema } from 'mongoose';
import { BaseSchema } from './base.schema';

export const SemesterSchema: Schema = new Schema({
    ...BaseSchema,
    semester_name: { type: String, required: true },
});
