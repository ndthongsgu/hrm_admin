import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { ROUTES } from "@/common/constants/routes";
import { useDetailOfficeLocation } from "@/hooks/officeLocation";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";
import { OFFICE_LOCATION_STATUS } from "@/common/constants/payrollPeriod";

const { Text } = Typography;

export default function DetailOfficeLocationScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailOfficeLocation(id ?? "");
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  const handleEdit = () => {
    router.push(
      ROUTES.MAIN.PAYROLL_MANAGER.children.OFFICE_LOCATIONS.children.EDIT_OFFICE_LOCATION.path.replace(
        ":id",
        id ?? "",
      ),
    );
  };

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
                <Text type="secondary">Tên địa điểm</Text>
                <Text strong>{data?.name}</Text>
              </Space>
            </Col>
            <Col span={16}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Địa chỉ</Text>
                <Text strong>{data?.address}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="II. Tọa độ địa lý">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Vĩ độ (Latitude)</Text>
                <Text strong>{data?.latitude}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Kinh độ (Longitude)</Text>
                <Text strong>{data?.longitude}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Bán kính (Mét)</Text>
                <Text strong>{data?.radius}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="III. Trạng thái">
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Trạng thái duyệt</Text>
                <Tag
                  color={
                    OFFICE_LOCATION_STATUS[
                      data?.status as keyof typeof OFFICE_LOCATION_STATUS
                    ]?.color
                  }
                >
                  {
                    OFFICE_LOCATION_STATUS[
                      data?.status as keyof typeof OFFICE_LOCATION_STATUS
                    ]?.label
                  }
                </Tag>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Trạng thái hoạt động</Text>
                <Tag color={data?.isDeleted ? "red" : "green"}>
                  {data?.isDeleted ? "Ngừng hoạt động" : "Hoạt động"}
                </Tag>
              </Space>
            </Col>
          </Row>
        </Card>

        <ActionLog functionId={id ?? ""} functionType="OFFICE_LOCATION" />
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
              Quay lại
            </Button>
            {!data?.isDeleted && data?.status === "PENDING" && (
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            )}
          </Space>
        </div>
      </Space>
    </BaseView>
  );
}
