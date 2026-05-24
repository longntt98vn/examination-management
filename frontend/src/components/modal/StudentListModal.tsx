import {
  Button,
  Checkbox,
  Flex,
  Select,
  Table,
  type TableColumnsType,
} from "antd";
import Search from "antd/es/input/Search";
import { useState } from "react";
import { CustomModal } from "../modal/CustomModal";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { useStudentListModal } from "./hooks/useStudentListModal";
import type { User } from "../../constants/types";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const StudentListModal = () => {
  const { modals, openModal, closeModal } = useModal();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { localStudents, onSelectStudent, localSelectedStudents } =
    useStudentListModal();
  const haveSelect =
    modals[MODAL_TYPES.STUDENT_LIST].data.selectedStudents &&
    modals[MODAL_TYPES.STUDENT_LIST].data.setSelectedStudents;

  const columns: TableColumnsType<User> = [
    {
      title: "Chọn",
      render: (_, record) => (
        <Checkbox
          checked={localSelectedStudents.includes(record._id)}
          onChange={() => onSelectStudent(record._id)}
        />
      ),
    },
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
    },
    {
      title: "Ngày sinh",
      dataIndex: "date_of_birth",
      render: (_, record) => {
        return record.date_of_birth
          ? new Date(record.date_of_birth).toLocaleDateString()
          : "";
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "location",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Flex>
          <Button type="link" onClick={() => {}}>
            Chi tiết
          </Button>
          <Button type="link" onClick={() => {}}>
            Sửa
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <CustomModal
      open={modals[MODAL_TYPES.STUDENT_LIST].isOpen}
      onOk={() => {
        const { students, setSelectedStudents } =
          modals[MODAL_TYPES.STUDENT_LIST].data;
        if (haveSelect) {
          setSelectedStudents?.(
            students.filter((student) =>
              localSelectedStudents.includes(student._id),
            ),
          );
        }
        closeModal(MODAL_TYPES.STUDENT_LIST);
      }}
      onCancel={() => closeModal(MODAL_TYPES.STUDENT_LIST)}
      title="Sinh viên"
    >
      <Flex style={{ marginBottom: 16 }}>
        <Search
          placeholder="MSV hoặc tên"
          allowClear
          enterButton
          onSearch={() => {}}
          style={{ height: 32, width: "50%", marginRight: 16 }}
        />

        <Select
          mode="multiple"
          placeholder="Lọc theo năm sinh"
          value={selectedItems}
          onChange={setSelectedItems}
          style={{ height: 32, width: "50%" }}
          options={localStudents.map((item) => ({
            value: item.date_of_birth,
            label: new Date(item.date_of_birth).toLocaleDateString(),
          }))}
        />
      </Flex>

      <Table<User>
        columns={haveSelect ? columns : [...columns.slice(1)]}
        dataSource={localStudents}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 55 * 5 }}
        rowKey={"_id"}
      />
    </CustomModal>
  );
};
