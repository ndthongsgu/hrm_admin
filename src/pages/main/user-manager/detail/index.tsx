import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Title from "@/components/title";
import type { UserDto } from "@/dto/user.dto";
import { useDetailUser } from "@/hooks/user";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export const colorMap = {
  true: "green",
  false: "red",
};
export const textMap = {
  true: "Hoạt động",
  false: "Không hoạt động",
};

export default function DetailUserScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailUser(id || "");

  return (
    <BaseView>
      <Title>Xem chi tiết người dùng</Title>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết",
            key: "1",
            children: (
              <DetailView data={data as UserDto} isLoading={isLoading} />
            ),
          },
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: (
              <ActionLogView functionType="Users" functionId={id ?? ""} />
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
  data: UserDto;
  isLoading: boolean;
}) => {
  const router = useRouter();

  return (
    <div style={{ padding: "16px 0" }}>
      {/* I. Thông tin người dùng */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin người dùng
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
              Tên đăng nhập
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.username}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Email
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.email}
            </Text>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Họ tên
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.fullName || "-"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Số điện thoại
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.phoneNumber || "-"}
            </Text>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Vai trò
            </Text>
            <Row gutter={[4, 4]} style={{ marginTop: "8px" }}>
              {data?.roles && data.roles.length > 0 ? (
                data.roles.map((role, index) => (
                  <Tag key={index} color="blue">
                    {role.name}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">-</Text>
              )}
            </Row>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Trạng thái
            </Text>
            <Tag
              color={colorMap[data?.isActive as unknown as keyof typeof colorMap]}
            >
              {textMap[data?.isActive as unknown as keyof typeof textMap]}
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
