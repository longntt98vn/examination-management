import {
  Button,
  Flex,
  Select,
  Table,
  Tooltip,
  type TableColumnsType,
} from "antd";
import Search from "antd/es/input/Search";
import { useState } from "react";
import { CustomModal } from "../modal/CustomModal";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { useExamListModal } from "./hooks/useExamListModal";
import type { Exam } from "../../constants/types";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ExamListModal = () => {
  const { modals, openModal, closeModal } = useModal();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { exams, semesters } = useExamListModal();

  const columns: TableColumnsType<Exam> = [
    {
      title: "Mã đợt thi",
      render: (_, record) => {
        return (
          <Tooltip title={record._id}>
            {record._id.slice(0, 4) + "..." + record._id.slice(-4)}
          </Tooltip>
        );
      },
    },
    {
      title: "Học kỳ",
      render: (_, record) => {
        return record.semester.semester_name;
      },
    },
    {
      title: "Môn thi",
      render: (_, record) => {
        return record.subject.subject_name;
      },
    },
    {
      title: "Ngày thi",
      render: (_, record) => {
        return record.exam_date;
      },
    },
    {
      title: "Phòng thi",
      render: (_, record) => {
        return record.room_number;
      },
    },
    {
      title: "Thao tác",
      width: 200,
      render: (_, record) => (
        <Flex>
          <Button
            type="link"
            onClick={() => {
              openModal(MODAL_TYPES.EXAM_ADD_EDIT, { examId: record._id });
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="link"
            onClick={() => {
              openModal(MODAL_TYPES.INPUT_SCORES, { examId: record._id });
            }}
          >
            Chấm điểm
          </Button>
          <Button
            type="link"
            onClick={() => {
              openModal(MODAL_TYPES.VALIDATE_SCORE, { examId: record._id });
            }}
          >
            Phê duyệt điểm
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <CustomModal
      open={modals[MODAL_TYPES.EXAM_LIST].isOpen}
      onOk={() => closeModal(MODAL_TYPES.EXAM_LIST)}
      onCancel={() => closeModal(MODAL_TYPES.EXAM_LIST)}
      title="Quản lý đợt thi"
    >
      <Flex justify="end" style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            closeModal(MODAL_TYPES.EXAM_LIST);
            openModal(MODAL_TYPES.EXAM_ADD_EDIT);
          }}
        >
          Tạo đợt thi mới
        </Button>
      </Flex>

      <Flex style={{ marginBottom: 16 }}>
        <Search
          placeholder="Môn thi"
          allowClear
          enterButton
          onSearch={() => {}}
          style={{ height: 32, width: "50%", marginRight: 16 }}
        />

        <Select
          mode="multiple"
          placeholder="Học kỳ"
          value={selectedItems}
          onChange={setSelectedItems}
          style={{ height: 32, width: "50%" }}
          options={semesters.map((semester) => ({
            value: semester,
            label: semester,
          }))}
        />
      </Flex>

      <Table<Exam>
        columns={columns}
        dataSource={exams}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 55 * 5 }}
        rowKey="_id"
      />
    </CustomModal>
  );
};
