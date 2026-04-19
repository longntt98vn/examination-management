import { Schema } from 'mongoose';
const CandidateSchema: Schema = new Schema({
    id: { type: String, required: true },
    full_name: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    identity_card: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    exam_room: { type: String, required: true },
    exam_date: { type: Date, required: true },
    status: { type: String, required: true },
    registered_by: { type: String, required: false },
    registered_date: { type: Date, required: false },
});

export default CandidateSchema;
