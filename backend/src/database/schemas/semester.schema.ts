import { Schema } from 'mongoose';
import { BaseSchemaDefinition } from './base.schema';

export const SemesterSchema: Schema = new Schema({
    ...BaseSchemaDefinition,
    semester_name: { type: String, required: true },
});
