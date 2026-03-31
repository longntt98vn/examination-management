const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CandidateSchema = new Schema({
  ID: String,
  FullName: String,
  DateOfBirth: Date,
  IdentityCard: String,
  Email: String,
  Phone: String,
  ExamRoom: String,
  ExamDate: Date,
  Status: String,
  RegisteredBy: String,
  RegisteredDate: Date,
});
module.exports = { CandidateSchema };
