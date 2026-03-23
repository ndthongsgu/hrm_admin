import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { ROUTES } from "@/common/constants/routes";
import { useDetailPosition } from "@/hooks/position";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text, Title } = Typography;

export default function PositionDetailScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailPosition(id ?? "");
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  const handleEdit = () => {
    router.push(
      ROUTES.MAIN.POSITION_MANAGER.children.EDIT_POSITION.path.replace(
        ":id",
        id ?? ""
      )
    );
  };

  const goBack = () => {
    router.back();
  };

  const salary =
    data?.standardResponsibilityAllowance ?? data?.baseSalary;

  return (
    <BaseView>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
                Quay lại
              </Button>
              <Title level={3} style={{ margin: 0 }}>
                Chi tiết chức vụ
              </Title>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
          </Col>
        </Row>

        <Card title="I. Thông tin cơ bản">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Mã chức vụ</Text>
                <Text strong>{data?.code}</Text>
              </Space>
            </Col>
            <Col span={16}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Tên chức vụ</Text>
                <Text strong>{data?.name}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="II. Thông tin lương">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Lương cơ bản</Text>
                <Text strong>
                  {salary != null
                    ? salary.toLocaleString("vi-VN") + " VNĐ"
                    : "N/A"}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="III. Mô tả">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Mô tả</Text>
                <Text>{data?.description || "Không có mô tả"}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <ActionLog functionId={id ?? ""} functionType="POSITION" />
      </Space>
    </BaseView>
  );
}
