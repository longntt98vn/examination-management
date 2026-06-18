import { Modal } from "antd";

export const CustomModal = ({
  open,
  onOk,
  onCancel,
  title,
  children,
}: {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Modal
      title={title}
      centered
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Đồng ý"
      cancelText="Hủy bỏ"
      width={{
        xs: "80%",
      }}
      destroyOnHidden
    >
      {children}
    </Modal>
  );
};
