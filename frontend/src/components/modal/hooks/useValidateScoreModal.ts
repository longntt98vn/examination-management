import { useEffect, useState } from "react";
import { getCandidatesByConditions } from "../../../apis/candidate";
import { getAllScoreOnChain, updateScores } from "../../../apis/score";
import { ScoreStatus } from "../../../constants";
import type { Candidate, ScoreOnChain } from "../../../constants/types";
import { MODAL_TYPES, useModal } from "../../../providers/ModalProvider";

export const useValidateScoreModal = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const { modals, openModal, closeModal } = useModal();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [scoresOnChain, setScoresOnChain] = useState<ScoreOnChain[]>([]);

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
      getAllScoreOnChain().then((data) => {
        setScoresOnChain(data);
      });
    }
  }, [modals[MODAL_TYPES.VALIDATE_SCORE].isOpen]);

  return {
    candidates,
    setCandidates,
    selectedItems,
    setSelectedItems,
    onOk,
    scoresOnChain,
  };
};
