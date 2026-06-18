import React, { createContext, useContext, useReducer } from "react";
import { StudentListModal } from "../components/modal/StudentListModal";
import { EditAddExamModal } from "../components/modal/EditAddExamModal";
import { InputScoresModal } from "../components/modal/InputScoresModal";
import { ExamListModal } from "../components/modal/ExamListModal";
import { ScoreHistoryModal } from "../components/modal/ScoreHistoryModal";
import { ValidateScoreModal } from "../components/modal/ValidateScoreModal";
import { AddEditStudentModal } from "../components/modal/AddEditStudentModal";

// 1. Tạo Context
const ModalContext = createContext<{
  modals: Record<string, { isOpen: boolean; data: Record<string, any> }>;
  openModal: (modalType: string, payload?: Record<string, any>) => void;
  closeModal: (modalType: string) => void;
}>({
  modals: {},
  openModal: () => {},
  closeModal: () => {},
});

// 2. Định nghĩa các loại modal để tránh gõ nhầm string
export const MODAL_TYPES = {
  STUDENT_LIST: "STUDENT_LIST",
  EXAM_LIST: "EXAM_LIST",
  EXAM_ADD_EDIT: "EXAM_ADD_EDIT",
  SCORE_HISTORY: "SCORE_HISTORY",
  INPUT_SCORES: "INPUT_SCORES",
  VALIDATE_SCORE: "VALIDATE_SCORE",
  ADD_EDIT_STUDENT: "ADD_EDIT_STUDENT",
};

const initialState = {
  [MODAL_TYPES.STUDENT_LIST]: { isOpen: false, data: {} },
  [MODAL_TYPES.EXAM_LIST]: { isOpen: false, data: {} },
  [MODAL_TYPES.EXAM_ADD_EDIT]: { isOpen: false, data: {} },
  [MODAL_TYPES.SCORE_HISTORY]: { isOpen: false, data: {} },
  [MODAL_TYPES.INPUT_SCORES]: { isOpen: false, data: {} },
  [MODAL_TYPES.VALIDATE_SCORE]: { isOpen: false, data: {} },
  [MODAL_TYPES.ADD_EDIT_STUDENT]: { isOpen: false, data: {} },
};

// 2. Reducer xử lý dựa trên key của modal
const modalReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        [action.modalType]: {
          isOpen: true,
          data: action.payload || {},
        },
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        [action.modalType]: {
          ...state[action.modalType],
          isOpen: false,
        },
      };
    case "CLOSE_ALL":
      return initialState;
    default:
      return state;
  }
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, dispatch] = useReducer(modalReducer, initialState);
  const openModal = (modalType: string, payload: Record<string, any>) =>
    dispatch({ type: "OPEN_MODAL", modalType, payload });

  const closeModal = (modalType: string) =>
    dispatch({ type: "CLOSE_MODAL", modalType });

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modals }}>
      {children}
      <StudentListModal />
      <EditAddExamModal />
      <InputScoresModal />
      <ExamListModal />
      <ScoreHistoryModal />
      <ValidateScoreModal />
      <AddEditStudentModal />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};
