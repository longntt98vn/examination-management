import { useEffect, useState } from "react";
import type { ScoreLog } from "../../../constants/types";
import { MODAL_TYPES, useModal } from "../../../providers/ModalProvider";
import { getScoreHistory } from "../../../apis/score";
import { useNotification } from "../../../providers/NotificationProvider";

export const useScoreHistoryModal = () => {
  const [scoreHistory, setScoreHistory] = useState<ScoreLog[]>([]);
  const { modals, openModal, closeModal } = useModal();
  const { error } = useNotification();

  useEffect(() => {
    if (
      modals[MODAL_TYPES.SCORE_HISTORY].isOpen &&
      modals[MODAL_TYPES.SCORE_HISTORY].data.scoreId
    ) {
      getScoreHistory(modals[MODAL_TYPES.SCORE_HISTORY].data.scoreId).then(
        (data) => {
          if (data.errors) {
            error("Lấy lịch sử điểm thất bại", JSON.stringify(data.errors));
          } else {
            setScoreHistory(data);
          }
        },
      );
    }
  }, [modals[MODAL_TYPES.SCORE_HISTORY].isOpen]);

  return { scoreHistory, setScoreHistory };
};
