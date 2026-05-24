import { useEffect, useState } from "react";
import type { Candidate } from "../../../constants/types";
import { MODAL_TYPES, useModal } from "../../../providers/ModalProvider";
import { getCandidatesByConditions } from "../../../apis/candidate";
import { updateScores } from "../../../apis/score";
import { ScoreStatus } from "../../../constants";

export const useValidateScoreModal = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const { modals, openModal, closeModal } = useModal();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const onOk = () => {
    updateScores(
      selectedItems.map((item) => ({
        candidateId: item,
        value: candidates.find((c) => c._id === item)?.score?.value,
        status: ScoreStatus.ADMIN_SIGNED,
      })),
    ).then((data) => {
      console.log(data);
      closeModal(MODAL_TYPES.VALIDATE_SCORE);
    });
  };

  useEffect(() => {
    if (modals[MODAL_TYPES.VALIDATE_SCORE].isOpen) {
      getCandidatesByConditions({
        examId: modals[MODAL_TYPES.VALIDATE_SCORE].data.examId,
      }).then((data) => {
        setCandidates(data);
      });
    }
  }, [modals[MODAL_TYPES.VALIDATE_SCORE].isOpen]);

  return { candidates, setCandidates, selectedItems, setSelectedItems, onOk };
};
