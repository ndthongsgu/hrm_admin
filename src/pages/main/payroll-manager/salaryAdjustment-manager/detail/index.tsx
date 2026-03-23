import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailSalaryAdjustment } from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";
import { SALARY_ADJUSTMENT_TYPE } from "@/common/constants/payrollPeriod";

const { Text } = Typography;

export default function SalaryAdjustmentDetailScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailSalaryAdjustment(id ?? "");
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
                <Text type="secondary">Nhân viên</Text>
                <Text strong>{data?.employee?.fullName} ({data?.employee?.employeeCode})</Text>
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
                <Text type="secondary">Loại điều chỉnh</Text>
                <Tag color={SALARY_ADJUSTMENT_TYPE[data?.type as keyof typeof SALARY_ADJUSTMENT_TYPE]?.color}>
                  {SALARY_ADJUSTMENT_TYPE[data?.type as keyof typeof SALARY_ADJUSTMENT_TYPE]?.label}
                </Tag>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="II. Thông tin điều chỉnh">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Số tiền</Text>
                <Text strong style={{ color: (data?.amount || 0) >= 0 ? "green" : "red" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(data?.amount || 0)}
                </Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Chịu thuế</Text>
                <Tag color={data?.isTaxable ? "green" : "red"}>
                  {data?.isTaxable ? "Có" : "Không"}
                </Tag>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Chỉ áp dụng lương net</Text>
                <Tag color={data?.isNetOnly ? "blue" : "default"}>
                  {data?.isNetOnly ? "Có" : "Không"}
                </Tag>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="III. Lý do">
          <Text>{data?.reason || "Không có lý do"}</Text>
        </Card>

        <ActionLog functionId={id ?? ""} functionType="SALARY_ADJUSTMENT" />
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
              Quay lại
            </Button>
          </Space>
        </div>
      </Space>
    </BaseView>
  );
}