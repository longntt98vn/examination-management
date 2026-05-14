import {
  Button,
  Checkbox,
  Flex,
  Input,
  Row,
  Select,
  Table,
  type SelectProps,
  type TableColumnsType,
} from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { CustomModal } from "../modal/CustomModal";
import Search from "antd/es/input/Search";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const EditAddExamModal = () => {
  const { modals, openModal, closeModal } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      examName: "",
      subject: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toISOString().split("T")[1],
      room: "",
      teacher: "",
    },
  });
  const getExam = () => {};
  const addExam = (data: any) => {};
  const editExam = (data: any) => {};

  const onSubmit = (data: any) => {
    if (modals[MODAL_TYPES.EXAM_ADD_EDIT].data.examId) {
      editExam(data);
    } else {
      addExam(data);
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Chọn",
      width: 10,
      render: (_, record) => <Checkbox checked={false} />,
    },
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
  ];

  useEffect(() => {
    if (
      modals[MODAL_TYPES.EXAM_ADD_EDIT].isOpen &&
      modals[MODAL_TYPES.EXAM_ADD_EDIT].data.examId
    ) {
      getExam();
    }
  }, [modals[MODAL_TYPES.EXAM_ADD_EDIT].isOpen]);

  return (
    <CustomModal
      open={modals[MODAL_TYPES.EXAM_ADD_EDIT].isOpen}
      onOk={() => closeModal(MODAL_TYPES.EXAM_ADD_EDIT)}
      onCancel={() => closeModal(MODAL_TYPES.EXAM_ADD_EDIT)}
      title="Thêm đợt thi"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex vertical gap={4}>
          <label>Tên đợt thi</label>
          <Input {...register("examName")} />
          <label>Môn thi</label>
          <Input {...register("subject")} />
          <label>Ngày thi</label>
          <Input {...register("date")} type="date" />
          <label>Giờ thi</label>
          <Input {...register("time")} type="time" />
          <label>Phòng thi</label>
          <Input {...register("room")} />
          <label>Giáo viên chấm</label>
          <Search
            allowClear
            enterButton
            onSearch={() => {}}
            style={{ height: 32, width: "100%" }}
            {...register("teacher")}
          />
          <label>Sinh viên thi</label>
          <Button
            type="primary"
            style={{ width: 120 }}
            onClick={() => {
              openModal(MODAL_TYPES.STUDENT_LIST, {
                examId: modals[MODAL_TYPES.EXAM_ADD_EDIT].data.examId || 1234,
              });
            }}
          >
            Thêm sinh viên
          </Button>
          <Table<DataType>
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 55 * 5 }}
          />
        </Flex>
      </form>
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
