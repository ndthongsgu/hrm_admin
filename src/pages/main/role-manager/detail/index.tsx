import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Title from "@/components/title";
import type { RoleDto } from "@/dto/role.dto";
import { useRoleDetail } from "@/hooks/role";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export const colorMap = {
  true: "red",
  false: "green",
};
export const textMap = {
  true: "Không hoạt động",
  false: "Hoạt động",
};

export default function DetailRoleScreen() {
  const { id } = useParams();
  const { data, isLoading } = useRoleDetail(id || "");

  return (
    <BaseView>
      <Title>Xem chi tiết vai trò</Title>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết",
            key: "1",
            children: (
              <DetailView data={data as RoleDto} isLoading={isLoading} />
            ),
          },
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: (
              <ActionLogView functionType="Roles" functionId={id ?? ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({
  data,
  isLoading,
}: {
  data: RoleDto;
  isLoading: boolean;
}) => {
  const router = useRouter();

  return (
    <div style={{ padding: "16px 0" }}>
      {/* I. Thông tin vai trò */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin vai trò
          </Text>
        }
        style={{ marginBottom: "24px" }}
        loading={isLoading}
      >
        <Row gutter={[24, 24]}>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Mã vai trò
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.code}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Tên vai trò
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.name}
            </Text>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Mô tả
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.description}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Trạng thái
            </Text>
            <Tag
              color={colorMap[data?.isDeleted as unknown as keyof typeof colorMap]}
            >
              {textMap[data?.isDeleted as unknown as keyof typeof textMap]}
            </Tag>
          </Col>
        </Row>
      </Card>

      {/* Action Button */}
      <Row align={"middle"} justify={"center"}>
        <Button
          type="default"
          size="middle"
          icon={<LeftCircleOutlined />}
          onClick={() => router.back()}
        >
          Thoát
        </Button>
      </Row>
    </div>
  );
};
