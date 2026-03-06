import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { ROUTES } from "@/common/constants/routes";
import { useDetailDepartment } from "@/hooks/department";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text, Title } = Typography;

export default function DepartmentDetailScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailDepartment(id ?? "");
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  const handleEdit = () => {
    router.push(
      ROUTES.MAIN.DEPARTMENT_MANAGER.children.EDIT_DEPARTMENT.path.replace(
        ":id",
        id ?? ""
      )
    );
  };

  const goBack = () => {
    router.back();
  };

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
                Chi tiết phòng ban
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
                <Text type="secondary">Mã phòng ban</Text>
                <Text strong>{data?.code}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Tên phòng ban</Text>
                <Text strong>{data?.name}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Trạng thái</Text>
                <Text strong>
                  {data?.isActive ? "Hoạt động" : "Không hoạt động"}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="II. Thông tin tổ chức">
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Trưởng phòng</Text>
                <Text strong>{data?.managerName || "Chưa có"}</Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Phòng ban cha</Text>
                <Text strong>{data?.parentDepartmentName || "Không có"}</Text>
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

        <ActionLog functionId={id ?? ""} functionType="DEPARTMENT" />
      </Space>
    </BaseView>
  );
}
