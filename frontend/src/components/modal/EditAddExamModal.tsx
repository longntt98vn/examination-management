import {
  Button,
  Checkbox,
  DatePicker,
  Flex,
  Input,
  Select,
  Table,
  Tooltip,
  type TableColumnsType,
} from "antd";
import { useState } from "react";
import { Controller } from "react-hook-form";
import type {  User } from "../../constants/types";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { CustomModal } from "../modal/CustomModal";
import { OnChainTag } from "../OnChainTag";
import { useEditAddExamModal } from "./hooks/useEditAddExamModal";

export const EditAddExamModal = () => {
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
    candidateUsers,
    setCandidateUsers,
  } = useEditAddExamModal();
  const { register, handleSubmit, control } = methods;
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const columns: TableColumnsType<User> = [
    {
      title: "Chọn",
      width: 70,
      render: (_, record) => (
        <Checkbox
          checked={selectedStudents.includes(record._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStudents([...selectedStudents, record._id]);
            } else {
              setSelectedStudents(
                selectedStudents.filter((id) => id !== record._id),
              );
            }
          }}
        />
      ),
    },
    {
      title: "STT",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Họ và tên",
      render: (_, record) => {
        return record.name;
      },
    },
    {
      title: "Địa chỉ",
      render: (_, record) => {
        return (
          <Tooltip title={record.location}>
            {record.location.length > 15
              ? record.location.slice(0, 15) + "..."
              : record.location}
          </Tooltip>
        );
      },
    },
    {
      title: "Trạng thái chuỗi",
      render: (_, record) => {
        const target = candidates.find(
          (candidate) => candidate.user._id === record._id,
        );
        const isValid =
          candidatesOnChain.find(
            (candidate) => candidate.CandidateID === target?._id,
          )?.HashCode === target?.hash;
        return <OnChainTag isValid={!!isValid} />;
      },
    },
    {
      title: "Email",
      render: (_, record) => {
        return record.email;
      },
    },
    {
      title: "Số điện thoại",
      render: (_, record) => {
        return record.phone_number;
      },
    },
  ];

  return (
    <CustomModal
      open={modals[MODAL_TYPES.EXAM_ADD_EDIT].isOpen}
      onOk={() => {
        onSubmit(methods.getValues());
        // closeModal(MODAL_TYPES.EXAM_ADD_EDIT);
      }}
      onCancel={() => {
        closeModal(MODAL_TYPES.EXAM_ADD_EDIT);
        openModal(MODAL_TYPES.EXAM_LIST);
      }}
      title={
        modals[MODAL_TYPES.EXAM_ADD_EDIT].data.examId
          ? "Sửa đợt thi"
          : "Thêm đợt thi"
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex vertical gap={4}>
          <label>Tên đợt thi</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          <label>Môn thi</label>
          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                options={subjects.map((subject) => ({
                  value: subject._id,
                  label: subject.subject_name,
                }))}
              />
            )}
          />

          <label>Học kỳ</label>
          <Controller
            name="semesterId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                options={semesters.map((semester) => ({
                  value: semester._id,
                  label: semester.semester_name,
                }))}
                style={{ height: 32, width: "100%" }}
              />
            )}
          />
          <label>Ngày thi</label>
          <Controller
            name="examDate"
            control={control}
            render={({ field }) => (
              <DatePicker picker="date" style={{ width: "100%" }} {...field} />
            )}
          />
          <label>Phòng thi</label>
          <Controller
            name="roomNumber"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
          <label>Giáo viên chấm</label>
          <Controller
            name="teacherId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                style={{ height: 32, width: "100%" }}
                options={teachers.map((teacher) => ({
                  value: teacher._id,
                  label: teacher.name,
                }))}
              />
            )}
          />
          <label>Sinh viên thi</label>
          <Flex gap={16}>
            <Button
              type="primary"
              style={{ width: 120 }}
              onClick={() => {
                openModal(MODAL_TYPES.STUDENT_LIST, {
                  examId: modals[MODAL_TYPES.EXAM_ADD_EDIT].data.examId || 1234,
                  students: students,
                  selectedStudents: candidateUsers,
                  setSelectedStudents: setCandidateUsers,
                });
              }}
            >
              Thêm sinh viên
            </Button>
            <Button
              type="default"
              style={{ width: 120 }}
              onClick={() => {
                setCandidateUsers(
                  candidateUsers.filter(
                    (user) => !selectedStudents.includes(user._id),
                  ),
                );
              }}
            >
              Xóa sinh viên
            </Button>
          </Flex>
          <Table<User>
            // if !examId, hide  Trạng thái chuỗi column
            columns={
              modals[MODAL_TYPES.EXAM_ADD_EDIT].data.examId
                ? columns
                : columns.filter(
                    (column) => column.title !== "Trạng thái chuỗi",
                  )
            }
            dataSource={candidateUsers}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 55 * 5 }}
            rowKey={"_id"}
          />
        </Flex>
      </form>
    </CustomModal>
  );
};
