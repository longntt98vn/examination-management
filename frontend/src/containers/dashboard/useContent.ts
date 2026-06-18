import { useEffect, useState } from "react";
import type { Exam, ExamOnChain, User } from "../../constants/types";
import { getAllUsers } from "../../apis/user";
import { Role } from "../../constants";
import { getExams } from "../../apis/exam";

export const useContent = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examsOnChain, setExamsOnChain] = useState<ExamOnChain[]>([]);

  useEffect(() => {
    getAllUsers().then((data) => {
      setStudents(data.filter((user: User) => user.role === Role.STUDENT));
      setTeachers(data.filter((user: User) => user.role === Role.TEACHER));
    });
    getExams().then((data) => {
      setExams(data);
    });
    getExams({ getOnChain: true }).then((data) => {
      setExamsOnChain(data);
    });
  }, []);

  return {
    students,
    teachers,
    exams,
    examsOnChain,
  };
};
