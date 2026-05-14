import { Schema } from 'mongoose';
import { BaseSchema } from './base.schema';

export const SubjectSchema: Schema = new Schema({
    ...BaseSchema,
    subject_name: { type: String, unique: true, required: true },
});
