import { Button, Flex, Table, type TableColumnsType } from "antd";
import dayjs from "dayjs";
import { ScoreStatusMap } from "../../constants";
import type { ScoreLog } from "../../constants/types";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { CustomModal } from "../modal/CustomModal";
import { useScoreHistoryModal } from "./hooks/useScoreHistoryModal";
import CsvDownloader from "react-csv-downloader";

export const ScoreHistoryModal = () => {
  const { modals, openModal, closeModal } = useModal();
  const { scoreHistory, setScoreHistory } = useScoreHistoryModal();

  const columns: TableColumnsType<ScoreLog> = [
    {
      title: "STT",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tác nhân",
      render: (_, record) => {
        return record.user.name;
      },
    },
    {
      title: "Thời gian",
      render: (_, record) => {
        return dayjs(record.created_at).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      title: "Trước",
      render: (_, record) => {
        return (
          <Flex vertical>
            <div>{record.value_before}</div>
            <div>{ScoreStatusMap[record.status_before]}</div>
          </Flex>
        );
      },
    },
    {
      title: "Sau",
      render: (_, record) => {
        return (
          <Flex vertical>
            <div>{record.value_after}</div>
            <div>{ScoreStatusMap[record.status_after]}</div>
          </Flex>
        );
      },
    },
  ];

  return (
    <CustomModal
      open={modals[MODAL_TYPES.SCORE_HISTORY].isOpen}
      onOk={() => closeModal(MODAL_TYPES.SCORE_HISTORY)}
      onCancel={() => closeModal(MODAL_TYPES.SCORE_HISTORY)}
      title="Truy xuất nguồn gốc điểm"
    >
      <Flex>
        <CsvDownloader
          filename={`score-history - ${dayjs().format("DD-MM-YYYY HH:mm")}.csv`}
          datas={scoreHistory.map((item) => ({
            name: item.user.name,
            created_at: item.created_at,
            before:
              item.value_before + " - " + ScoreStatusMap[item.status_before],
            after: item.value_after + " - " + ScoreStatusMap[item.status_after],
          }))}
          columns={csvHeaders}
        >
          <Button type="primary" onClick={() => {}}>
            Xuất báo cáo
          </Button>
        </CsvDownloader>
      </Flex>

      <Table<ScoreLog>
        rowKey="_id"
        columns={columns}
        dataSource={scoreHistory}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 55 * 5 }}
      />
    </CustomModal>
  );
};

const csvHeaders = [
  { displayName: "Tác nân", id: "name" },
  { displayName: "Thời gian", id: "created_at" },
  { displayName: "Trước", id: "before" },
  { displayName: "Sau", id: "after" },
];
