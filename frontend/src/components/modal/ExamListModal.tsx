import { Button, Flex, Select, Table, type TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { useState } from "react";
import { CustomModal } from "../modal/CustomModal";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ExamListModal = () => {
  const { modals, openModal, closeModal } = useModal();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

  const columns: TableColumnsType<DataType> = [
    {
      title: "MSSV",
      dataIndex: "age",
      width: 10,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      width: 20,
    },
    {
      title: "Lớp",
      dataIndex: "address",
      width: 20,
    },
    {
      title: "Khoa",
      dataIndex: "address",
      width: 20,
    },
    {
      title: "Thao tác",
      width: 20,
      render: (_, record) => (
        <Flex>
          <Button
            type="link"
            onClick={() => {
              openModal(MODAL_TYPES.EXAM_ADD_EDIT, { examId: record.key });
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="link"
            onClick={() => {
              openModal(MODAL_TYPES.INPUT_SCORES, { examId: record.key });
            }}
          >
            Chấm điểm
          </Button>
          <Button
            type="link"
            onClick={() => {
              openModal(MODAL_TYPES.VALIDATE_SCORE, { examId: record.key });
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
          onClick={() => openModal(MODAL_TYPES.EXAM_ADD_EDIT)}
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
          options={filteredOptions.map((item) => ({
            value: item,
            label: item,
          }))}
        />
      </Flex>

      <Table<DataType>
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 55 * 5 }}
      />
    </CustomModal>
  );
};

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const dataSource = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];
