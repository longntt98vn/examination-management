import { MODAL_TYPES, useModal } from "../../../providers/ModalProvider";
import type { Candidate, Score } from "../../../constants/types";
import { useEffect, useState } from "react";
import { getCandidatesByConditions } from "../../../apis/candidate";
import { updateScores } from "../../../apis/score";
import { ScoreStatus } from "../../../constants";
import { useNotification } from "../../../providers/NotificationProvider";

export const useInputScoreModal = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const { modals, openModal, closeModal } = useModal();
  const { showNotification, success } = useNotification();

  useEffect(() => {
    if (
      modals[MODAL_TYPES.INPUT_SCORES].isOpen &&
      modals[MODAL_TYPES.INPUT_SCORES].data.examId
    ) {
      getCandidatesByConditions({
        examId: modals[MODAL_TYPES.INPUT_SCORES].data.examId,
      }).then((data) => {
        setCandidates(data);
      });
    }
  }, [modals[MODAL_TYPES.INPUT_SCORES].isOpen]);

  const onOk = () => {
    updateScores(
      candidates.map((c) => ({
        candidateId: c._id,
        status: ScoreStatus.TEACHER_SIGNED,
      })),
    ).then((data) => {
      console.log(data);
      if (data.errors) {
        showNotification({
          type: "error",
          message: "Cập nhật điểm thất bại",
          description: JSON.stringify(data.errors),
        });
      } else {
        showNotification({
          type: "success",
          message: "Cập nhật điểm thành công",
        });
        closeModal(MODAL_TYPES.INPUT_SCORES);
      }
    });
  };

  return { candidates, setCandidates, onOk };
};
