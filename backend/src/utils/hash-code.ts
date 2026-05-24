import sha256 from 'sha256';

export const generateExamHashCode = (
    examId: string,
    semesterId: string,
    subjectId: string,
    teacherId: string,
    name: string,
    examDate: Date,
    roomNumber: string,
    now: number
) => {
    return sha256(
        `${examId}-${semesterId}-${subjectId}-${teacherId}-${name}-${examDate}-${roomNumber}-${now}`
    );
};

export const generateScoreHashCode = (
    scoreId: string,
    candidateId: string,
    value: number,
    status: number,
    now: number
) => {
    return sha256(`${scoreId}-${candidateId}-${value}-${status}-${now}`);
};

export const generateCandidateHashCode = (
    candidateId: string,
    userId: string,
    examId: string,
    scoreId: string,
    status: number,
    now: number
) => {
    return sha256(
        `${candidateId}-${userId}-${examId}-${scoreId}-${status}-${now}`
    );
};
