import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailPayslip } from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import { PAYSLIP_STATUS } from "@/common/constants/payrollPeriod";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography, Divider } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function PayslipDetailScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailPayslip(id ?? "");
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  const goBack = () => {
    router.back();
  };

  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
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
                <Text type="secondary">Trạng thái duyệt</Text>
                <Tag color={PAYSLIP_STATUS[data?.status as keyof typeof PAYSLIP_STATUS]?.color || "gold"}>
                  {PAYSLIP_STATUS[data?.status as keyof typeof PAYSLIP_STATUS]?.label || "Chờ duyệt"}
                </Tag>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="II. Thu nhập">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Lương cơ sở</Text>
                <Text strong>{formatCurrency(data?.grossSalary)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Lương thanh toán theo công</Text>
                <Text strong>{formatCurrency(data?.salaryByWorkdays)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Tổng phụ cấp</Text>
                <Text strong>{formatCurrency(data?.totalAllowance)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Tổng thưởng/Phạt</Text>
                <Text strong style={{ color: (data?.totalBonus || 0) >= 0 ? "green" : "red" }}>
                  {formatCurrency(data?.totalBonus)}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="III. Bảo hiểm xã hội">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Cơ sở tính bảo hiểm</Text>
                <Text strong>{formatCurrency(data?.bhxhSalaryBase)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">BHXH</Text>
                <Text strong>{formatCurrency(data?.bhxhAmount)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">BHYT</Text>
                <Text strong>{formatCurrency(data?.bhytAmount)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">BHTN</Text>
                <Text strong>{formatCurrency(data?.bhtnAmount)}</Text>
              </Space>
            </Col>
            {data?.socialInsuranceBenefitAmount && data?.socialInsuranceBenefitAmount !== 0 && (
              <Col span={8}>
                <Space direction="vertical" size={0}>
                  <Text type="secondary">Trợ cấp BHXH</Text>
                  <Text strong style={{ color: "green" }}>{formatCurrency(data?.socialInsuranceBenefitAmount)}</Text>
                </Space>
              </Col>
            )}
          </Row>
        </Card>

        <Card title="IV. Thuế thu nhập cá nhân (PIT)">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Thu nhập chịu thuế</Text>
                <Text strong>{formatCurrency(data?.taxableIncome)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Giảm trừ cá nhân</Text>
                <Text strong>{formatCurrency(data?.deductionPersonal)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Giảm trừ người phụ thuộc</Text>
                <Text strong>{formatCurrency(data?.deductionDependents)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Thu nhập tính thuế</Text>
                <Text strong>{formatCurrency(data?.assessableIncome)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Tiền thuế phải nộp</Text>
                <Text strong style={{ color: "red" }}>{formatCurrency(data?.taxAmount)}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="V. Kết quả">
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Divider />
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: "16px" }}>Lương ròng</Text>
                <Text strong style={{ fontSize: "24px", color: "green" }}>
                  {formatCurrency(data?.netSalary)}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <ActionLog functionId={id ?? ""} functionType="PAYSLIP" />
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
            Quay lại
          </Button>
        </div>
      </Space>
    </BaseView>
  );
}
