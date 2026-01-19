import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { TripDto } from "@/dto/trip.dto";
import { useDetailTrip } from "@/hooks/trip";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Table, Tabs, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
const { Text } = Typography;

export default function DetailTripScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailTrip(id ?? "");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết chuyến đi</Title>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết chuyến đi",
            key: "1",
            children: data ? <DetailView data={data} /> : <Loading />,
          },
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: (
              <ActionLogView functionType="Trips" functionId={id ?? ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}
const DetailView = ({ data }: { data: TripDto }) => {
  const router = useRouter();

  return (
    <div className="p-4">
      {/* I. Thông tin chuyến đi */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            Thông tin chuyến đi
          </Text>
        }
        style={{ marginBottom: "24px", padding: "20px" }}
      >
        <Row gutter={[32, 32]}>
          <Col span={8}>
            <Text
              type="secondary"
              style={{
                display: "block",
                color: "#06498B",
              }}
            >
              Tuyến đường:
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              {data.route.startLocation} - {data.route.endLocation}
            </Text>
          </Col>
          <Col span={8}>
            <Text
              type="secondary"
              style={{
                display: "block",
                color: "#06498B",
              }}
            >
              Khoảng cách:
            </Text>
            <Text strong>{data.route.distanceKm} km</Text>
          </Col>
          <Col span={8}>
            <Text
              type="secondary"
              style={{
                display: "block",
                color: "#06498B",
              }}
            >
              Thời gian ước tính:
            </Text>
            <Text strong>{data.route.estimatedDuration} phút</Text>
          </Col>
          <Col span={8}>
            <Text
              type="secondary"
              style={{
                display: "block",
                color: "#06498B",
              }}
            >
              Thời gian khởi hành:
            </Text>
            <Text strong>
              {dayjs(data.departureTime).format("HH:mm DD/MM/YYYY")}
            </Text>
          </Col>
          <Col span={8}>
            <Text
              type="secondary"
              style={{ display: "block", color: "#06498B" }}
            >
              Giá vé:
            </Text>
            <Text strong>{data.price?.toLocaleString()} VND</Text>
          </Col>
        </Row>
      </Card>

      {/* II. Danh sách điểm dừng */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            Danh sách điểm dừng
          </Text>
        }
        style={{ marginBottom: "24px", padding: "24px" }}
      >
        <Table
          dataSource={data.tripStops}
          rowKey="id"
          pagination={false}
          columns={[
            { title: "STT", dataIndex: "orderIndex", key: "orderIndex" },
            { title: "Địa điểm", dataIndex: "location", key: "location" },
            {
              title: "Loại điểm dừng",
              dataIndex: "stopType",
              key: "stopType",
              render: (type) =>
                type === "DROPOFF" ? (
                  <Tag color="blue">Điểm trả</Tag>
                ) : (
                  <Tag color="green">Điểm đón</Tag>
                ),
            },
          ]}
        />
      </Card>

      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            Danh sách xe tham gia chuyến đi
          </Text>
        }
        style={{ marginBottom: "24px", padding: "24px" }}
      >
        <Table
          dataSource={data.tripCars}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: "STT",
              key: "index",
              render: (_, __, index) => index + 1,
            },
            {
              title: "Mã xe",
              dataIndex: ["car", "code"],
              key: "carCode",
            },
            {
              title: "Biển số xe",
              dataIndex: ["car", "licensePlate"],
              key: "licensePlate",
            },
            {
              title: "Loại xe",
              key: "carType",
              render: (_, record) => record.car.carType?.name,
            },
            {
              title: "Số ghế",
              key: "seatCount",
              render: (_, record) => record.car.carType?.seatCount,
            },
            {
              title: "Giá vé",
              dataIndex: "price",
              key: "price",
              render: (price: number) => `${price?.toLocaleString()} VND`,
            },
          ]}
        />
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
