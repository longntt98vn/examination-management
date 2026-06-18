import {
  Button,
  Flex,
  Input,
  Select,
  Table,
  Tooltip,
  type TableColumnsType,
} from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { CustomModal } from "../modal/CustomModal";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { useInputScoreModal } from "./hooks/useInputScoreModal";
import type { Candidate } from "../../constants/types";
import { ScoreStatusMap } from "../../constants";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const InputScoresModal = () => {
  const { modals, openModal, closeModal } = useModal();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { candidates, setCandidates, onOk } = useInputScoreModal();

  const columns: TableColumnsType<Candidate> = [
    {
      title: "STT",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "MSSV",
      render: (_, r) => (
        <Tooltip title={r.user._id}>
          {r.user._id.slice(0, 4) + "..." + r.user._id.slice(-4)}
        </Tooltip>
      ),
    },
    {
      title: "Họ và tên",
      render: (_, r) => r.user.name,
    },
    {
      title: "Khoa",
      render: (_, r) => {
        // mock data with random string
        return (
          "Khoa " + Math.random().toString(36).substring(2, 15).slice(0, 4)
        );
      },
    },
    {
      title: "Lớp",
      render: (_, r) =>
        "Lớp " + Math.random().toString(36).substring(2, 15).slice(0, 4),
    },
    {
      title: "Điểm",
      render: (_, r) => (
        <Input
          type="number"
          defaultValue={r.score?.value.toString()}
          max={10}
          min={0}
          onChange={(e) => {
            setCandidates(
              candidates.map((c) =>
                c._id === r._id
                  ? {
                      ...c,
                      score: { ...c.score, value: Number(e.target.value) },
                    }
                  : c,
              ),
            );
          }}
        />
      ),
    },
    {
      title: "Trạng thái",
      render: (_, r) => ScoreStatusMap[r.score?.status],
    },
    // {
    //   title: "Thao tác",
    //   render: (_, r) => (
    //     <Flex>
    //       <Button type="link" onClick={() => {}}>
    //         Ký số
    //       </Button>
    //     </Flex>
    //   ),
    // },
  ];

  return (
    <CustomModal
      open={modals[MODAL_TYPES.INPUT_SCORES].isOpen}
      onOk={onOk}
      onCancel={() => closeModal(MODAL_TYPES.INPUT_SCORES)}
      title="Nhập điểm thi"
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
          placeholder="Lọc theo trạng thái"
          value={selectedItems}
          onChange={setSelectedItems}
          style={{ height: 32, width: "50%" }}
          options={candidates.map((item) => ({
            value: item.status,
            label: item.status.toString(),
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
