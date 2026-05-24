import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createExam,
  getAllSemesters,
  getAllSubjects,
  getExamById,
} from "../../../apis/exam";
import { CandidateStatus, Role } from "../../../constants";
import type { Semester, Subject, User } from "../../../constants/types";
import { MODAL_TYPES, useModal } from "../../../providers/ModalProvider";
import { getAllUsers } from "../../../apis/user";
import dayjs from "dayjs";
import { updateCandidates } from "../../../apis/candidate";

type Props = {
  examId?: string;
};

export const useEditAddExamModal = ({ examId }: Props) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [candidates, setCandidates] = useState<User[]>([]);
  const methods = useForm({
    defaultValues: {
      name: "",
      semesterId: "",
      subjectId: "",
      teacherId: "",
      examDate: "",
      roomNumber: "",
      candidateIds: [],
    },
  });
  const { register, setValue } = methods;

  const { modals, openModal, closeModal } = useModal();

  const onSubmit = (data: any) => {
    createExam({
      semesterId: data.semesterId,
      subjectId: data.subjectId,
      teacherId: data.teacherId,
      name: data.name,
      examDate: dayjs(data.examDate).toDate(),
      roomNumber: data.roomNumber,
      candidateIds: candidates.map((candidate: User) => candidate._id),
    }).then(async (data) => {
      console.log(data);
      const examId = data.data._id;
      await updateCandidates(
        candidates.map((item) => ({
          userId: item._id,
          examId: examId,
          score: null,
          status: CandidateStatus.PENDING,
        })),
      ).then((data) => {
        console.log(data);
        closeModal(MODAL_TYPES.EXAM_ADD_EDIT);
        openModal(MODAL_TYPES.EXAM_LIST);
      });
    });
  };

  useEffect(() => {
    if (!modals[MODAL_TYPES.EXAM_ADD_EDIT].isOpen) return;

    getAllUsers().then((data) => {
      setTeachers(
        data.filter((user: User) => user.role === Role.TEACHER) as User[],
      );
      setStudents(
        data.filter((user: User) => user.role === Role.STUDENT) as User[],
      );
    });
    getAllSemesters().then((data) => {
      setSemesters(data as Semester[]);
    });
    getAllSubjects().then((data) => {
      setSubjects(data as Subject[]);
    });

    if (examId) {
      getExamById(examId).then((data) => {
        console.log(data);
        // setValue("name", data.name);
        // setValue("semester", data.semester);
        // setValue("subject", data.subject);
        // setValue("teacher", data.teacher);
      });
    }
  }, [modals[MODAL_TYPES.EXAM_ADD_EDIT].isOpen]);

  return {
    methods,
    teachers,
    students,
    semesters,
    subjects,
    onSubmit,
    candidates,
    setCandidates,
  };
};
