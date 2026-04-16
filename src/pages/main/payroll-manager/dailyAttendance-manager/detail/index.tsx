import { DAILY_ATTENDANCE_STATUS } from "@/common/constants/payrollPeriod";
import { formatDateTime } from "@/common/helpers/format";
import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailDailyAttendance } from "@/hooks/payroll/dailyAttendance";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DailyAttendanceDetailScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailDailyAttendance(id ?? "");
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  const goBack = () => {
    router.back();
  };

  const getStatusLabel = (status: string) => {
    const statusObj = Object.values(DAILY_ATTENDANCE_STATUS).find(
      (s) => s.value === status
    );
    return statusObj?.label || status;
  };

  const getStatusColor = (status: string) => {
    const statusObj = Object.values(DAILY_ATTENDANCE_STATUS).find(
      (s) => s.value === status
    );
    return statusObj?.color || "default";
  };

  return (
    <BaseView>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="I. Thông tin cơ bản">
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
                <Text type="secondary">Trạng thái</Text>
                <Text>
                  <Tag color={getStatusColor(data?.status || "")}>
                    {getStatusLabel(data?.status || "")}
                  </Tag>
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="II. Thông tin chấm công">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Ngày chấm công</Text>
                <Text strong>
                  {data?.date
                    ? new Date(data.date).toLocaleDateString("vi-VN")
                    : "-"}
                </Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Giờ vào</Text>
                <Text strong>{data?.checkInTime ? formatDateTime(data.checkInTime) : "-"}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Giờ ra</Text>
                <Text strong>{data?.checkOutTime ? formatDateTime(data.checkOutTime) : "-"}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <ActionLog functionId={id ?? ""} functionType="DAILY_ATTENDANCE" />
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
            Quay lại
          </Button>
        </div>
      </Space>
    </BaseView>
  );
}