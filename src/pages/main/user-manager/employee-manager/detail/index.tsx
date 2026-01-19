import { formatDate } from "@/common/helpers/format";
import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { EmployeeDto } from "@/dto/employee.dto";
import type { RoleDto } from "@/dto/role.dto";
import { useDetailEmployee } from "@/hooks/employee";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DetailEmployeeScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailEmployee(id ?? "");
  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết nhân viên</Title>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết",
            key: "1",
            children: data ? <DetailView data={data} /> : <Loading />,
          },
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: (
              <ActionLogView functionType="Employees" functionId={id || ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: EmployeeDto }) => {
  const router = useRouter();

  return (
    <div style={{ padding: "16px 0" }}>
      {/* I. Thông tin nhân viên */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin nhân viên
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[24, 24]}>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Mã nhân viên
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.code}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Tên nhân viên
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.name}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Ngày thêm vào
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {formatDate(data?.createdDate)}
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
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Số điện thoại
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.phone}
            </Text>
          </Col>
          <Col span={24} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Vai trò
            </Text>
            <div style={{ marginTop: "8px" }}>
              {data?.roles?.map((role: RoleDto) => (
                <Tag
                  key={role.id}
                  color="blue"
                  style={{ marginBottom: "4px", fontSize: "14px" }}
                >
                  {role.name}
                </Tag>
              )) || <Text type="secondary">Không có vai trò</Text>}
            </div>
          </Col>
          <Col span={24} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Mô tả
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.description || "Không có"}
            </Text>
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
