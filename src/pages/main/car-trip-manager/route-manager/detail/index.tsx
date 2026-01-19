import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { RouteDto } from "@/dto/route.dto";
import { formatMinutesToHourMinute } from "@/helpers/time";
import { useDetailRoute } from "@/hooks/route";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DetailRouteScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailRoute(id ?? "");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết tuyến đường</Title>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết tuyến đường",
            key: "1",
            children: data ? <DetailView data={data} /> : <Loading />,
          },
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: (
              <ActionLogView functionType="Routes" functionId={id ?? ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: RouteDto }) => {
  const router = useRouter();

  return (
    <div className="p-4">
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin tuyến đường
          </Text>
        }
        style={{ marginBottom: "24px", padding: "24px" }}
      >
        <Row gutter={[32, 32]} align="top">
          <Col span={12}>
            <Text
              type="secondary"
              style={{
                fontSize: "14px",
                display: "block",
                color: "#06498B",
              }}
            >
              Điểm xuất phát
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data.startLocation}
            </Text>
          </Col>

          <Col span={12}>
            <Text
              type="secondary"
              style={{
                fontSize: "14px",
                display: "block",
                color: "#06498B",
              }}
            >
              Điểm đến
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data.endLocation}
            </Text>
          </Col>

          <Col span={12}>
            <Text
              type="secondary"
              style={{
                fontSize: "14px",
                display: "block",
                color: "#06498B",
              }}
            >
              Khoảng cách
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data.distanceKm} km
            </Text>
          </Col>

          <Col span={12}>
            <Text
              type="secondary"
              style={{
                fontSize: "14px",
                display: "block",
                color: "#06498B",
              }}
            >
              Thời gian dự kiến
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {formatMinutesToHourMinute(data.estimatedDuration)}
            </Text>
          </Col>

          <Col span={12}>
            <Text
              type="secondary"
              style={{
                fontSize: "14px",
                display: "block",
                color: "#06498B",
              }}
            >
              Trạng thái
            </Text>
            <Tag color={data.isDeleted ? "red" : "green"}>
              {data.isDeleted ? "Không hoạt động" : "Hoạt động"}
            </Tag>
          </Col>
        </Row>
      </Card>

      {/* Nút quay lại */}
      <Row align="middle" justify="center" className="mt-6">
        <Button
          type="default"
          size="large"
          icon={<LeftCircleOutlined />}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </Row>
    </div>
  );
};
