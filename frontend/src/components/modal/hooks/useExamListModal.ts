import { useEffect, useMemo, useState } from "react";
import { getExams } from "../../../apis/exam";
import { MODAL_TYPES, useModal } from "../../../providers/ModalProvider";
import type { Exam } from "../../../constants/types";

export const useExamListModal = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { modals } = useModal();

  const semesters = useMemo(() => {
    return exams.map((exam) => exam.semester.semester_name);
  }, [exams]);

  useEffect(() => {
    if (modals[MODAL_TYPES.EXAM_LIST].isOpen) {
      getExams().then((data) => {
        setExams(data as Exam[]);
      });
    }
  }, [modals[MODAL_TYPES.EXAM_LIST].isOpen]);

  return { exams, loading, error, semesters };
};
