import { Schema } from 'mongoose';

export const SemesterSchema: Schema = new Schema({
    semester_id: { type: String, required: true, unique: true, index: true },
    semester_name: { type: String, required: true },
    start_date: { type: Number, required: false, default: null },
    end_date: { type: Number, required: false, default: null },
});
