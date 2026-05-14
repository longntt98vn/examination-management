import {
  Button,
  Checkbox,
  Flex,
  Select,
  Table,
  type TableColumnsType,
} from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { CustomModal } from "../modal/CustomModal";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ValidateScoreModal = () => {
  const { modals, openModal, closeModal } = useModal();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

  const getExams = () => {};

  useEffect(() => {
    if (modals[MODAL_TYPES.VALIDATE_SCORE].isOpen) {
      getExams();
    }
  }, [modals[MODAL_TYPES.VALIDATE_SCORE].isOpen]);

  return (
    <CustomModal
      open={modals[MODAL_TYPES.VALIDATE_SCORE].isOpen}
      onOk={() => closeModal(MODAL_TYPES.VALIDATE_SCORE)}
      onCancel={() => closeModal(MODAL_TYPES.VALIDATE_SCORE)}
      title="Đối soát và phê duyệt điểm"
    >
      <Flex>
        <Button type="primary" onClick={() => {}}>
          Ký số và phê duyệt
        </Button>
      </Flex>
      <Flex style={{ margin: "16px 0" }}>
        <Search
          placeholder="MSV hoặc tên"
          allowClear
          enterButton
          onSearch={() => {}}
          style={{ height: 32, width: "50%", marginRight: 16 }}
        />

        <Select
          mode="multiple"
          placeholder="Lọc theo khoa"
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

const columns: TableColumnsType<DataType> = [
  {
    title: "Chọn",
    width: 10,
    render: (_, record) => <Checkbox checked={false} />,
  },
  {
    title: "MSSV",
    dataIndex: "studentId",
    width: 20,
  },
  {
    title: "Họ và tên",
    dataIndex: "name",
    width: 20,
  },
  {
    title: "Điểm",
    dataIndex: "score",
    width: 20,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    width: 20,
  },
  {
    title: "Thao tác",
    width: 20,
    render: (_, record) => (
      <Flex>
        <Button type="link" onClick={() => {}}>
          Ghi chú
        </Button>
        <Button type="link" onClick={() => {}}>
          Lịch sử
        </Button>
      </Flex>
    ),
  },
];

const dataSource = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];
