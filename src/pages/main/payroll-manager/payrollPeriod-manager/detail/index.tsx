import { PAYROLL_PERIOD_STATUS } from "@/common/constants/payrollPeriod";
import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailPayrollPeriod } from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function PayrollPeriodDetailScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailPayrollPeriod(id ?? "");
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
        <Card title="I. Thông tin cơ bản">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Tên kỳ lương</Text>
                <Text strong>{data?.name}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Trạng thái</Text>
                <Text>
                  <Tag color={PAYROLL_PERIOD_STATUS[data?.status as keyof typeof PAYROLL_PERIOD_STATUS]?.color}>
                    {PAYROLL_PERIOD_STATUS[data?.status as keyof typeof PAYROLL_PERIOD_STATUS]?.label}
                  </Tag>
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="II. Thông tin thời gian">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Ngày bắt đầu</Text>
                <Text strong>
                  {data?.startDate
                    ? new Date(data.startDate).toLocaleDateString("vi-VN")
                    : "-"}
                </Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Ngày kết thúc</Text>
                <Text strong>
                  {data?.endDate
                    ? new Date(data.endDate).toLocaleDateString("vi-VN")
                    : "-"}
                </Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Số ngày làm việc</Text>
                <Text strong>{data?.standardWorkingDays || 0}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <ActionLog functionId={id ?? ""} functionType="PAYROLL_PERIOD" />
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
