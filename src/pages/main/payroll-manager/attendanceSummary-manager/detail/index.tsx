import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailAttendanceSummary } from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";
import { ROUTES } from "@/common/constants/routes";
import { ATTENDANCE_SUMMARY_STATUS } from "@/common/constants/payrollPeriod";

const { Text } = Typography;

export default function AttendanceSummaryDetailScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailAttendanceSummary(id ?? "");
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  const goBack = () => {
    router.back();
  };

  const goToEdit = () => {
    router.push(
      ROUTES.MAIN.PAYROLL_MANAGER.children.ATTENDANCE_SUMMARY.children.EDIT_ATTENDANCE_SUMMARY.path.replace(
        ":id",
        id ?? "",
      ),
    );
  };

  return (
    <BaseView>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="I. Thông tin nhân viên">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Tên nhân viên</Text>
                <Text strong>{data?.employee?.fullName}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Mã nhân viên</Text>
                <Text strong>{data?.employee?.employeeCode}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Kỳ lương</Text>
                <Text strong>{data?.payrollPeriod?.name}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Trạng thái</Text>
                <Text>
                  <Tag
                    color={
                      ATTENDANCE_SUMMARY_STATUS[
                        data?.status as keyof typeof ATTENDANCE_SUMMARY_STATUS
                      ]?.color
                    }
                  >
                    {
                      ATTENDANCE_SUMMARY_STATUS[
                        data?.status as keyof typeof ATTENDANCE_SUMMARY_STATUS
                      ]?.label
                    }
                  </Tag>
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="II. Thông tin công">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Ngày công thực tế</Text>
                <Text strong>{data?.actualWorkingDays || 0}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Ngày nghỉ có lương</Text>
                <Text strong>{data?.paidLeaveDays || 0}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Ngày nghỉ không lương</Text>
                <Text strong>{data?.unpaidLeaveDays || 0}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Giờ làm thêm</Text>
                <Text strong>{data?.overtimeHours || 0}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <ActionLog functionId={id ?? ""} functionType="ATTENDANCE_SUMMARY" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            width: "100%",
          }}
        >
          {(data?.status !== ATTENDANCE_SUMMARY_STATUS.APPROVED.value) && (
            <Button type="primary" icon={<EditOutlined />} onClick={goToEdit}>
              Chỉnh sửa
            </Button>
          )}
          <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
            Quay lại
          </Button>
        </div>
      </Space>
    </BaseView>
  );
}
