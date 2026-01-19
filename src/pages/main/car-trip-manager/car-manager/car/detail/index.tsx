import SteeringWheel from "@/assets/icons/steering_wheel.svg";
import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { CarDto } from "@/dto/car.dto";
import { useDetailCar } from "@/hooks/car";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DetailCarScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailCar(id ?? "");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết xe</Title>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết xe",
            key: "1",
            children: data ? <DetailView data={data} /> : <Loading />,
          },
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: (
              <ActionLogView functionType="Cars" functionId={id ?? ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: CarDto }) => {
  const router = useRouter();
  const sortedSeats = [...(data.carSeats || [])].sort((a, b) =>
    a.seatNumber.localeCompare(b.seatNumber)
  );
  const SEATS_PER_ROW = 3;
  const totalSeats = sortedSeats.length;
  const desiredHalf = Math.ceil(totalSeats / 2);
  let lowerCount = Math.ceil(desiredHalf / SEATS_PER_ROW) * SEATS_PER_ROW;
  if (lowerCount > totalSeats) lowerCount = totalSeats;
  const lowerFloorSeats = sortedSeats.slice(0, lowerCount);
  const upperFloorSeats = sortedSeats.slice(lowerCount);
  const groupSeatsIntoColumns = (seats: any[]) => {
    const columns: string[][] = [[], [], []];
    seats.forEach((seat, idx) => {
      const col = idx % SEATS_PER_ROW;
      columns[col].push(seat.seatNumber);
    });
    return columns;
  };

  const lowerFloor = groupSeatsIntoColumns(lowerFloorSeats);
  const upperFloor = groupSeatsIntoColumns(upperFloorSeats);

  const seatStatus: Record<string, string> = {};
  const selectedSeats: string[] = [];

  return (
    <div className="p-4">
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin xe
          </Text>
        }
        style={{ marginBottom: "24px", padding: "24px" }}
      >
        <Row gutter={[32, 32]} align="top">
          {/* Cột bên trái: thông tin xe */}
          <Col span={10}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "14px",
                    display: "block",
                    color: "#06498B",
                  }}
                >
                  Mã xe
                </Text>
                <Text strong style={{ fontSize: "18px" }}>
                  {data?.code}
                </Text>
              </Col>

              <Col span={24}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "14px",
                    display: "block",
                    color: "#06498B",
                  }}
                >
                  Biển số xe
                </Text>
                <Text strong style={{ fontSize: "18px" }}>
                  {data?.licensePlate}
                </Text>
              </Col>

              <Col span={24}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "14px",
                    display: "block",
                    color: "#06498B",
                  }}
                >
                  Số ghế
                </Text>
                <Text strong style={{ fontSize: "18px" }}>
                  {data?.carType?.seatCount}
                </Text>
              </Col>

              <Col span={24}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "14px",
                    display: "block",
                    color: "#06498B",
                  }}
                >
                  Loại xe
                </Text>
                <Text strong style={{ fontSize: "18px" }}>
                  {data?.carType?.name}
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
          </Col>

          {/* Cột bên phải: sơ đồ ghế */}
          <Col span={14}>
            <SeatLayout
              lowerFloor={lowerFloor}
              upperFloor={upperFloor}
              selectedSeats={selectedSeats}
              seatStatus={seatStatus}
            />
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
interface SeatLayoutProps {
  lowerFloor: string[][];
  upperFloor: string[][];
  selectedSeats: string[];
  seatStatus: Record<string, string>;
}

const SeatLayout = ({
  lowerFloor,
  upperFloor,
  selectedSeats,
  seatStatus,
}: SeatLayoutProps) => {
  const getSeatStatus = (seatLabel: string) => {
    if (selectedSeats.includes(seatLabel)) return "selected";
    return seatStatus[seatLabel] || "available";
  };

  const Seat = ({ seatNum, status }: { seatNum: string; status: string }) => {
    const style: React.CSSProperties = {
      width: 40,
      height: 40,
      borderRadius: 8,
      margin: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 500,
      cursor: status === "sold" ? "not-allowed" : "pointer",
      background:
        status === "available"
          ? "#E6F7FF"
          : status === "selected"
          ? "#1890FF"
          : "#F5F5F5",
      opacity: status === "sold" ? 0.6 : 1,
      position: "relative",
      border: "2px solid #ccc",
      color: "#595959",
    };

    return <div style={style}>{seatNum}</div>;
  };

  const renderFloor = (floor: string[][], isLower: boolean) => (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {isLower && (
        <div style={{ marginBottom: 10 }}>
          <img src={SteeringWheel} width={30} height={30} alt="Steering" />
        </div>
      )}
      <h4 style={{ color: "#06498B", fontWeight: 600 }}>
        {isLower ? "Tầng dưới" : "Tầng trên"}
      </h4>

      <div style={{ display: "flex", justifyContent: "center" }}>
        {floor.map((column, colIndex) => (
          <div
            key={colIndex}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {column.map((seatLabel) => (
              <Seat
                key={seatLabel}
                seatNum={seatLabel}
                status={getSeatStatus(seatLabel)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Sơ đồ ghế */}
      <div>{renderFloor(lowerFloor, true)}</div>
      <div style={{ marginTop: 40 }}>{renderFloor(upperFloor, false)}</div>
    </div>
  );
};
