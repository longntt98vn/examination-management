import { Schema } from 'mongoose';
import { BaseSchemaDefinition } from './base.schema';

export const SubjectSchema: Schema = new Schema({
    ...BaseSchemaDefinition,
    subject_name: { type: String, unique: true, required: true },
});
