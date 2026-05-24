export enum Role {
  ADMIN = 3,
  OFFICE = 2,
  TEACHER = 1,
  STUDENT = 0,
}

export enum CandidateStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export enum ScoreStatus {
  NOT_SIGNED = 0,
  TEACHER_SIGNED = 1,
  ADMIN_SIGNED = 2,
}

export const ScoreStatusMap = {
  [ScoreStatus.NOT_SIGNED]: "Chưa ký",
  [ScoreStatus.TEACHER_SIGNED]: "Đã ký của giáo viên",
  [ScoreStatus.ADMIN_SIGNED]: "Đã ký của admin",
};
