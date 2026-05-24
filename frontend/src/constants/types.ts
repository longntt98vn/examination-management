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
};

export type Candidate = {
  _id: string;
  user: User;
  exam: Exam;
  score: Score;
  status: CandidateStatus;
};

export type Semester = {
  _id: string;
  semester_name: string;
};

export type Subject = {
  _id: string;
  subject_name: string;
};
