import {
  Button,
  Checkbox,
  DatePicker,
  Flex,
  Input,
  Row,
  Select,
  Table,
  Tooltip,
  type SelectProps,
  type TableColumnsType,
} from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { CustomModal } from "../modal/CustomModal";
import Search from "antd/es/input/Search";
import { useEditAddExamModal } from "./hooks/useEditAddExamModal";
import type { Candidate, User } from "../../constants/types";
import { OnChainTag } from "../OnChainTag";
import { CheckCircleTwoTone } from "@ant-design/icons";

export const AddEditStudentModal = () => {
  const { modals, openModal, closeModal } = useModal();
  const {
    methods,
    teachers,
    students,
    semesters,
    subjects,
    onSubmit,
    candidates,
    setCandidates,
    candidatesOnChain,
  } = useEditAddExamModal();
  const { register, handleSubmit, control } = methods;
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  return (
    <CustomModal
      open={modals[MODAL_TYPES.ADD_EDIT_STUDENT].isOpen}
      onOk={() => {
        onSubmit(methods.getValues());
        // closeModal(MODAL_TYPES.EXAM_ADD_EDIT);
      }}
      onCancel={() => {
        closeModal(MODAL_TYPES.ADD_EDIT_STUDENT);
      }}
      title="Sửa thông tin sinh viên"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <div style={{ scale: 1.5 }}>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          </div>
          <span style={{ marginLeft: 8 }}>Đã đồng bộ</span>
        </div>
        <Flex gap={16}>
          <Flex vertical gap={4} style={{ width: "50%" }}>
            <label>Mã sinh viên</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={"1234567890"}
                  style={{ width: "100%" }}
                />
              )}
            />
            <label>Họ và tên</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={"Nguyễn Văn A"}
                  style={{ width: "100%" }}
                />
              )}
            />
            <label>Ngày sinh</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={"1990-01-01"}
                  style={{ width: "100%" }}
                />
              )}
            />
            <label>Giới tính</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} value={"Nam"} style={{ width: "100%" }} />
              )}
            />
          </Flex>
          <Flex vertical gap={4} style={{ width: "50%" }}>
            <label>Quê quán</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} value={"Hà Nội"} style={{ width: "100%" }} />
              )}
            />
            <label>Số điện thoại</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={"0909090909"}
                  style={{ width: "100%" }}
                />
              )}
            />
            <label>Email</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={"nguyenvana@gmail.com"}
                  style={{ width: "100%" }}
                />
              )}
            />
            <label>Số điện thoại phụ huynh</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={"0909090909"}
                  style={{ width: "100%" }}
                />
              )}
            />
          </Flex>
        </Flex>
      </form>
    </CustomModal>
  );
};
