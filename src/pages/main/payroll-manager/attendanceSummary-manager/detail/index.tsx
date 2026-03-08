import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailAttendanceSummary } from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

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

  return (
    <BaseView>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="I. Thông tin nhân viên">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Tên nhân viên</Text>
                <Text strong>{data?.employeeName}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Mã nhân viên</Text>
                <Text strong>{data?.employeeCode}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Trạng thái duyệt</Text>
                <Text>
                  <Tag color={data?.isApproved ? "green" : "gold"}>
                    {data?.isApproved ? "Đã duyệt" : "Chưa duyệt"}
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
