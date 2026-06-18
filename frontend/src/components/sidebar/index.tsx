import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { Logo, MenuHeading, NavItem, NavMenu } from "./constants";

export const Sidebar = () => {
  const { openModal } = useModal();
  return (
    <>
      <Logo>
        <h1>
          <span>HVKTQS</span>
        </h1>
      </Logo>
      <NavMenu>
        <MenuHeading>Chức năng chính</MenuHeading>
        <NavItem $active>
          <span>Bảng điều khiển</span>
        </NavItem>
        <NavItem onClick={() => openModal(MODAL_TYPES.STUDENT_LIST)}>
          <span>Sinh viên</span>
        </NavItem>
        <NavItem onClick={() => openModal(MODAL_TYPES.EXAM_LIST)}>
          <span>Đợt thi</span>
        </NavItem>
        <NavItem>
          <span>Giáo viên</span>
        </NavItem>
        <NavItem>
          <span>Lớp học</span>
        </NavItem>

        <MenuHeading>Tài khoản</MenuHeading>
        <NavItem>
          <span>Cài đặt</span>
        </NavItem>
        <NavItem>
          <span>Đăng xuất</span>
        </NavItem>
      </NavMenu>
    </>
  );
};
