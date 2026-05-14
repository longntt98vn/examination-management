import { Button, Flex, Select, Table, type TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { useState } from "react";
import { CustomModal } from "../modal/CustomModal";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const StudentListModal = () => {
  const { modals, openModal, closeModal } = useModal();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

  return (
    <CustomModal
      open={modals[MODAL_TYPES.STUDENT_LIST].isOpen}
      onOk={() => closeModal(MODAL_TYPES.STUDENT_LIST)}
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

const dataSource = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];
