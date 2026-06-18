import type { CandidateStatus, Role, ScoreStatus } from ".";

export type Exam = {
  _id: string;
  name: string;
  semester: {
    semester_name: string;
  };
  subject: {
    subject_name: string;
  };
  teacher: {
    name: string;
  };
  exam_date: string;
  room_number: string;
  hash: string;
};

export type User = {
  _id: string;
  name: string;
  role: Role;
  date_of_birth: number;
  email: string;
  gender: string;
  phone_number: string;
  parent_number: string;
  location: string;
};

export type Score = {
  _id: string;
  value: number;
  status: ScoreStatus;
  hash: string;
};

export type Candidate = {
  _id: string;
  user: User;
  exam: Exam;
  score: Score;
  status: CandidateStatus;
  hash: string;
};

export type ScoreLog = {
  _id: string;
  user: User;
  value_before: number;
  value_after: number;
  status_before: ScoreStatus;
  status_after: ScoreStatus;
  created_at: string;
};

export type ScoreOnChain = {
  CandidateID: string;
  HashCode: string;
  ID: string;
  ScoreID: string;
  Status: number;
  docType: string;
};

export type ExamOnChain = {
  ExamID: string;
  HashCode: string;
  ID: string;
  Status: number;
  docType: string;
};

export type CandidateOnChain = {
  CandidateID: string;
  ExamID: string;
  HashCode: string;
  ID: string;
  Status: number;
  docType: string;
};

export type Semester = {
  _id: string;
  semester_name: string;
};

export type Subject = {
  _id: string;
  subject_name: string;
};
