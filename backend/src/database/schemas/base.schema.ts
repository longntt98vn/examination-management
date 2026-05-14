import { Schema } from 'mongoose';

export const BaseSchema: Schema = new Schema({
    is_deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
