import { Button, Flex, Table, type TableColumnsType } from "antd";
import { useEffect } from "react";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { CustomModal } from "../modal/CustomModal";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ScoreHistoryModal = () => {
  const { modals, openModal, closeModal } = useModal();

  const getScoreHistory = () => {};

  useEffect(() => {
    if (modals[MODAL_TYPES.SCORE_HISTORY].isOpen) {
      getScoreHistory();
    }
  }, [modals[MODAL_TYPES.SCORE_HISTORY]]);

  return (
    <CustomModal
      open={modals[MODAL_TYPES.VALIDATE_SCORE].isOpen}
      onOk={() => closeModal(MODAL_TYPES.VALIDATE_SCORE)}
      onCancel={() => closeModal(MODAL_TYPES.VALIDATE_SCORE)}
      title="Truy xuất nguồn gốc điểm"
    >
      <Flex>
        <Button type="primary" onClick={() => {}}>
          Xuất báo cáo
        </Button>
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
  source: string;
  time: string;
  score: string;
  before: string;
  after: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Tác nhân",
    dataIndex: "source",
    width: 20,
  },
  {
    title: "Thời gian",
    dataIndex: "time",
    width: 20,
  },
  {
    title: "Điểm",
    dataIndex: "score",
    width: 20,
  },
  {
    title: "Trước đó",
    dataIndex: "before",
    width: 20,
  },
  {
    title: "Sau đó",
    dataIndex: "after",
    width: 20,
  },
];

const dataSource = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  source: `Source ${i}`,
  time: `Time ${i}`,
  score: `Score ${i}`,
  before: `Before ${i}`,
  after: `After ${i}`,
}));
