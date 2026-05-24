import {
  Button,
  Checkbox,
  DatePicker,
  Flex,
  Input,
  Row,
  Select,
  Table,
  type SelectProps,
  type TableColumnsType,
} from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MODAL_TYPES, useModal } from "../../providers/ModalProvider";
import { CustomModal } from "../modal/CustomModal";
import Search from "antd/es/input/Search";
import { useEditAddExamModal } from "./hooks/useEditAddExamModal";
import type { User } from "../../constants/types";

type Props = {
  examId?: string;
};

export const EditAddExamModal = ({ examId }: Props) => {
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
  } = useEditAddExamModal({ examId });
  const { register, handleSubmit, control } = methods;
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const columns: TableColumnsType<User> = [
    {
      title: "Chọn",
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
      render: (_, __, index) => index + 1,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
    },
    {
      title: "Ngày sinh",
      dataIndex: "date_of_birth",
      render: (_, record) => {
        return record.date_of_birth
          ? new Date(record.date_of_birth).toLocaleDateString()
          : "";
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "location",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
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
      title="Thêm đợt thi"
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
                  selectedStudents: candidates,
                  setSelectedStudents: setCandidates,
                });
              }}
            >
              Thêm sinh viên
            </Button>
            <Button type="default" style={{ width: 120 }} onClick={() => {}}>
              Xóa sinh viên
            </Button>
          </Flex>
          <Table<User>
            columns={columns}
            dataSource={candidates}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 55 * 5 }}
            rowKey={"_id"}
          />
        </Flex>
      </form>
    </CustomModal>
  );
};
