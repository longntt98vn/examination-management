import { useEffect, useMemo, useState } from "react";
import { getExams } from "../../../apis/exam";
import { MODAL_TYPES, useModal } from "../../../providers/ModalProvider";
import type { Exam, ExamOnChain } from "../../../constants/types";

export const useExamListModal = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examsOnChain, setExamsOnChain] = useState<ExamOnChain[]>([]);
  const { modals } = useModal();

  const semesters = useMemo(() => {
    return exams.map((exam) => exam.semester.semester_name);
  }, [exams]);

  useEffect(() => {
    if (modals[MODAL_TYPES.EXAM_LIST].isOpen) {
      getExams().then((data) => {
        setExams(data as Exam[]);
      });
      getExams({ getOnChain: true }).then((data) => {
        setExamsOnChain(data as ExamOnChain[]);
      });
    }
  }, [modals[MODAL_TYPES.EXAM_LIST].isOpen]);

  return { exams, semesters, examsOnChain };
};
