import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createExam,
  getAllSemesters,
  getAllSubjects,
  getExamById,
} from "../../../apis/exam";
import { CandidateStatus, Role } from "../../../constants";
import type {
  CandidateOnChain,
  Semester,
  Subject,
  User,
  Candidate,
} from "../../../constants/types";
import { MODAL_TYPES, useModal } from "../../../providers/ModalProvider";
import { getAllUsers } from "../../../apis/user";
import dayjs from "dayjs";
import {
  getCandidatesByConditions,
  updateCandidates,
} from "../../../apis/candidate";
import { useNotification } from "../../../providers/NotificationProvider";

export const useEditAddExamModal = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidateUsers, setCandidateUsers] = useState<User[]>([]);
  const [candidatesOnChain, setCandidatesOnChain] = useState<
    CandidateOnChain[]
  >([]);
  const methods = useForm({
    defaultValues: {
      name: "",
      semesterId: "",
      subjectId: "",
      teacherId: "",
      examDate: null,
      roomNumber: "",
      candidateIds: [],
    },
  });
  const { setValue } = methods;
  const { error, success } = useNotification();
  const loading = useRef(false);

  const { modals, openModal, closeModal } = useModal();

  const onSubmit = (data: any) => {
    createExam({
      examId: modals[MODAL_TYPES.EXAM_ADD_EDIT].data.examId || undefined,
      semesterId: data.semesterId,
      subjectId: data.subjectId,
      teacherId: data.teacherId,
      name: data.name,
      examDate: dayjs(data.examDate).toDate(),
      roomNumber: data.roomNumber,
      candidateIds: candidates.map((candidate) => candidate._id),
    }).then(async (data) => {
      if (data.errors) {
        error(
          modals[MODAL_TYPES.EXAM_ADD_EDIT].data.examId
            ? "Cập nhật đợt thi thất bại"
            : "Tạo đợt thi thất bại",
          JSON.stringify(data.errors),
        );
        return;
      }

      const examId = data.data._id;

      await updateCandidates(
        candidateUsers.map((item) => {
          const target = candidates.find(
            (candidate) => candidate.user._id === item._id,
          );
          return {
            candidateId: target?._id,
            userId: item._id,
            examId: examId,
            score: null,
            status: CandidateStatus.PENDING,
          };
        }),
      ).then((data) => {
        if (data.errors) {
          error(
            modals[MODAL_TYPES.EXAM_ADD_EDIT].data.examId
              ? "Cập nhật đợt thi thất bại"
              : "Tạo đợt thi thất bại",
            JSON.stringify(data.errors),
          );
          return;
        }

        success(
          modals[MODAL_TYPES.EXAM_ADD_EDIT].data.examId
            ? "Cập nhật đợt thi thành công"
            : "Tạo đợt thi thành công",
        );
        closeModal(MODAL_TYPES.EXAM_ADD_EDIT);
        openModal(MODAL_TYPES.EXAM_LIST);
      });
    });
  };

  useEffect(() => {
    const { data, isOpen } = modals[MODAL_TYPES.EXAM_ADD_EDIT];
    if (!isOpen) {
      loading.current = false;
      return;
    }

    if (loading.current) return;

    loading.current = true;

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

    if (data.examId) {
      getExamById(data.examId).then((data) => {
        setValue("name", data.name);
        setValue("semesterId", data.semester._id);
        setValue("subjectId", data.subject._id);
        setValue("teacherId", data.teacher._id);
        setValue("examDate", dayjs(data.exam_date));
        setValue("roomNumber", data.room_number);
        setCandidates(data.candidates.map((candidate) => candidate));
        setCandidateUsers(data.candidates.map((candidate) => candidate.user));
      });
      getCandidatesByConditions({ getOnChain: true }).then((data) => {
        setCandidatesOnChain(data as CandidateOnChain[]);
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
    candidatesOnChain,
    candidateUsers,
    setCandidateUsers,
  };
};
