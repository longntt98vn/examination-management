import type { TableColumnsType } from "antd";
import { Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { OnChainTag } from "../../components/OnChainTag";
import {
  ActionButtons,
  Button,
  CardChange,
  CardHeader,
  CardIcon,
  CardLabel,
  CardValue,
  MainContent,
  PageTitle,
  StatCard,
  StatsCards,
  Title,
} from "../../constants/styles";
import type { Exam, User } from "../../constants/types";
import { useContent } from "./useContent";

export const Content = () => {
  const { students, teachers, exams, examsOnChain } = useContent();

  const columns: TableColumnsType<Exam> = [
    {
      title: "Mã đợt thi",
      render: (_, record) => {
        return (
          <Tooltip title={record._id}>
            {record._id.slice(0, 4) + "..." + record._id.slice(-4)}
          </Tooltip>
        );
      },
    },
    {
      title: "Học kỳ",
      render: (_, record) => {
        return record.semester.semester_name;
      },
    },
    {
      title: "Môn thi",
      render: (_, record) => {
        return record.subject.subject_name;
      },
    },
    {
      title: "Ngày thi",
      render: (_, record) => {
        return record.exam_date
          ? dayjs(record.exam_date).format("DD/MM/YYYY")
          : "";
      },
    },

    {
      title: "Phòng thi",
      render: (_, record) => {
        return record.room_number;
      },
    },
    {
      title: "Trạng thái chuỗi",
      render: (_, record) => {
        const isValid =
          examsOnChain.find((exam) => exam.ExamID === record._id)?.HashCode ===
          record.hash;
        return <OnChainTag isValid={!!isValid} />;
      },
    },
  ];

  const studentColumns: TableColumnsType<User> = [
    {
      title: "STT",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
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
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
    },
  ];

  return (
    <MainContent>
      <PageTitle>
        <Title>Trang điều khiển</Title>
        <ActionButtons>
          <Button $variant="outline" className="btn">
            <i className="fas fa-download" />
            Xuất dữ liệu
          </Button>
          <Button className="btn">
            <i className="fas fa-plus" />
            Thêm mới
          </Button>
        </ActionButtons>
      </PageTitle>

      <StatsCards>
        <StatCard $variant={1}>
          <CardHeader>
            <div>
              <CardValue className="card-value">{students.length}</CardValue>
              <CardLabel>Số lượng học viên</CardLabel>
            </div>
            <CardIcon className="card-icon" $color="purple">
              <i className="fas fa-users" />
            </CardIcon>
          </CardHeader>
          <CardChange $positive>
            <i className="fas fa-arrow-up" />
            <span>{students.length}</span>
          </CardChange>
        </StatCard>

        <StatCard $variant={2}>
          <CardHeader>
            <div>
              <CardValue className="card-value">{teachers.length}</CardValue>
              <CardLabel>Số lượng giáo viên</CardLabel>
            </div>
            <CardIcon className="card-icon" $color="blue">
              <i className="fas fa-dollar-sign" />
            </CardIcon>
          </CardHeader>
          <CardChange $positive>
            <i className="fas fa-arrow-up" />
            <span>{teachers.length}</span>
          </CardChange>
        </StatCard>

        <StatCard $variant={3}>
          <CardHeader>
            <div>
              <CardValue className="card-value">{exams.length}</CardValue>
              <CardLabel>Số lượng đợt thi</CardLabel>
            </div>
            <CardIcon className="card-icon" $color="green">
              <i className="fas fa-shopping-cart" />
            </CardIcon>
          </CardHeader>
          <CardChange $positive={false}>
            <i className="fas fa-arrow-down" />
            <span>{exams.length}</span>
          </CardChange>
        </StatCard>
      </StatsCards>
      <PageTitle>
        <Title>Danh sách đợt thi</Title>
      </PageTitle>
      <Table<Exam>
        columns={columns}
        dataSource={exams}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 55 * 8 }}
        rowKey="_id"
      />
      <PageTitle>
        <Title>Danh sách sinh viên</Title>
      </PageTitle>
      <Table<User>
        columns={studentColumns}
        dataSource={students}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 55 * 8 }}
        rowKey={"_id"}
      />
    </MainContent>
  );
};
