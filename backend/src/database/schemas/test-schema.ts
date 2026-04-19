import { Schema } from 'mongoose';

export const TestSchema: Schema = new Schema({
    name: { type: String },
    role: {
        type: String,
        enum: {
            values: ['student', 'teacher'],
            message: 'Role {VALUE} is not supported',
        },
    },
    location: { type: String, default: 'Ha Noi' },
    date_of_birth: { type: Date, default: new Date().getTime() },
    email: { type: String, set: toLower },
    vnu_id: { type: String, index: { unique: true }, dropDups: true },
});
function toLower(v: string) {
    return v.toLowerCase();
}
