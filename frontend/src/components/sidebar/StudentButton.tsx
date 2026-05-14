import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { NavItem } from "./constants";

export const StudentButton = () => {
  const { openModal } = useModal();

  return (
    <NavItem onClick={() => openModal(MODAL_TYPES.STUDENT_LIST)}>
      <span>Sinh viên</span>
    </NavItem>
  );
};
