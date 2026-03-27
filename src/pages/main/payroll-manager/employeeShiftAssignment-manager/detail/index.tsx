import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailEmployeeShiftAssignment } from "@/hooks/employeeShiftAssignment";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function EmployeeShiftAssignmentDetailScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailEmployeeShiftAssignment(id ?? "");
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  const goBack = () => {
    router.back();
  };

  const formatDate = (date?: string) => {
    return date || "-";
  };

  return (
    <BaseView>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="I. Thông tin nhân viên">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Mã nhân viên</Text>
                <Text strong>{data?.employeeCode}</Text>
              </Space>
            </Col>
            <Col span={16}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Tên nhân viên</Text>
                <Text strong>{data?.employeeName}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="II. Thông tin ca làm việc">
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Ca làm việc</Text>
                <Text strong>{data?.shiftName}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="III. Thời gian gán">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Ngày bắt đầu</Text>
                <Text strong>{formatDate(data?.startDate || undefined)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Ngày kết thúc</Text>
                <Text strong>{formatDate(data?.endDate || undefined)}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <ActionLog functionId={id ?? ""} functionType="SHIFT_ASSIGNMENT" />
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
