import {
  Button,
  Checkbox,
  Flex,
  Select,
  Table,
  Tooltip,
  type TableColumnsType,
} from "antd";
import { ScoreStatusMap } from "../../constants";
import type { Candidate } from "../../constants/types";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { CustomModal } from "../modal/CustomModal";
import { OnChainTag } from "../OnChainTag";
import { useValidateScoreModal } from "./hooks/useValidateScoreModal";

export const ValidateScoreModal = () => {
  const { modals, openModal, closeModal } = useModal();
  const { candidates, selectedItems, setSelectedItems, onOk, scoresOnChain } =
    useValidateScoreModal();

  const columns: TableColumnsType<Candidate> = [
    {
      title: "Chọn",
      width: 70,
      render: (_, record) => (
        <Checkbox
          checked={selectedItems.includes(record._id)}
          onChange={(e) => {
            setSelectedItems(
              e.target.checked
                ? [...selectedItems, record._id]
                : selectedItems.filter((item) => item !== record._id),
            );
          }}
        />
      ),
    },
    {
      title: "MSV",
      render: (_, record) => {
        return (
          <Tooltip title={record.user._id}>
            {record.user._id.slice(0, 4) + "..." + record.user._id.slice(-4)}
          </Tooltip>
        );
      },
    },
    {
      title: "Họ và tên",
      render: (_, record) => {
        return record.user.name;
      },
    },
    {
      title: "Khoa",
      render: (_, record) => {
        return (
          "Khoa " + Math.random().toString(36).substring(2, 15).slice(0, 4)
        );
      },
    },
    {
      title: "Lớp",
      render: (_, record) => {
        return "Lớp " + Math.random().toString(36).substring(2, 15).slice(0, 4);
      },
    },
    {
      title: "Điểm",
      width: 70,
      render: (_, record) => {
        return record.score?.value.toString();
      },
    },
    {
      title: "Trạng thái",
      render: (_, record) => {
        return ScoreStatusMap[record.score?.status];
      },
    },
    {
      title: "Trạng thái chuỗi",
      render: (_, record) => {
        const isValid =
          scoresOnChain.find((score) => score.ScoreID === record.score?._id)
            .HashCode === record.score?.hash;
        return <OnChainTag isValid={!!isValid} />;
      },
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Flex>
          <Button type="link" onClick={() => {}}>
            Ghi chú
          </Button>
          <Button
            type="link"
            onClick={() => {
              openModal(MODAL_TYPES.SCORE_HISTORY, {
                scoreId: record.score?._id,
              });
            }}
          >
            Lịch sử
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <CustomModal
      open={modals[MODAL_TYPES.VALIDATE_SCORE].isOpen}
      onOk={() => closeModal(MODAL_TYPES.VALIDATE_SCORE)}
      onCancel={() => closeModal(MODAL_TYPES.VALIDATE_SCORE)}
      title="Đối soát và phê duyệt điểm"
    >
      <Flex>
        <Button type="primary" onClick={onOk}>
          Phê duyệt điểm
        </Button>
      </Flex>
      <Flex style={{ margin: "16px 0" }} gap={16}>
        <Select
          allowClear
          placeholder="Lọc theo sinh viên"
          style={{ height: 32, width: "100%" }}
          options={candidates.map((candidate) => ({
            value: candidate._id,
            label: candidate.user.name,
          }))}
        />

        <Select
          allowClear
          placeholder="Lọc theo trạng thái"
          style={{ height: 32, width: "100%" }}
          options={candidates.map((candidate) => ({
            value: candidate.score?.status,
            label: ScoreStatusMap[candidate.score?.status],
          }))}
        />
      </Flex>

      <Table<Candidate>
        rowKey="_id"
        columns={columns}
        dataSource={[...candidates]}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 55 * 5 }}
      />
    </CustomModal>
  );
};
