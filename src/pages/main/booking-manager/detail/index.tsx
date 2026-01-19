import { formatCurrency, formatDateTime } from "@/common/helpers/format";
import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { BookingDto, BookingStatusType } from "@/dto/booking.dto";
import { BookingStatusColors, BookingStatusLabels } from "@/dto/booking.dto";
import { useDetailBooking } from "@/hooks/booking";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function BookingDetail() {
  const { id } = useParams();
  const bookingId = id as string;
  const { data, isLoading } = useDetailBooking(bookingId);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết đặt xe</Title>
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
              <ActionLogView functionType="Bookings" functionId={id ?? ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: BookingDto }) => {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    return BookingStatusColors[status as BookingStatusType] || "default";
  };

  const getStatusLabel = (status: string) => {
    return BookingStatusLabels[status as BookingStatusType] || status;
  };

  return (
    <div style={{ padding: "16px 0" }}>
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {/* I. Thông tin khách hàng */}
        <Card
          title={
            <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
              I. Thông tin khách hàng
            </Text>
          }
          style={{ marginBottom: "24px", width: "50%" }}
        >
          <Row gutter={[24, 24]}>
            <Col span={12} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Khách hàng
              </Text>
              <Text strong>{data.customer?.name}</Text>
            </Col>
            <Col span={12} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Số điện thoại
              </Text>
              <Text strong>{data.customer?.phone}</Text>
            </Col>
            <Col span={24} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Email
              </Text>
              <Text strong>{data.customer?.email}</Text>
            </Col>
            <Col span={24} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Loại khách hàng
              </Text>
              <Text strong>{data.customer?.customerType?.name}</Text>
            </Col>
          </Row>
        </Card>
        <Card
          title={
            <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
              I. Thông tin đặt xe
            </Text>
          }
          style={{ marginBottom: "24px", width: "50%" }}
        >
          <Row gutter={[24, 24]}>
            <Col span={8} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Mã đặt xe
              </Text>
              <Text strong>{data.code}</Text>
            </Col>

            <Col span={8} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Loại đặt xe
              </Text>
              <Text strong>
                {data.type === "ROUNDTRIP"
                  ? "Khứ hồi"
                  : data.type === "ONEWAY"
                  ? "Một chiều"
                  : "Lỗi dữ liệu"}
              </Text>
            </Col>

            <Col span={8} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Tuyến đường
              </Text>
              <Text strong>
                {data.trip.route.startLocation} → {data.trip.route.endLocation}
              </Text>
            </Col>

            <Col span={8} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Thời gian đi
              </Text>
              <Text strong>{formatDateTime(data.trip.departureTime)}</Text>
            </Col>

            <Col span={8} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Tổng tiền
              </Text>
              <Text strong style={{ color: "#52c41a" }}>
                {formatCurrency(data.totalPrice)}
              </Text>
            </Col>

            <Col span={8} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Trạng thái
              </Text>
              <Tag color={getStatusColor(data.bookingStatus)}>
                {getStatusLabel(data.bookingStatus)}
              </Tag>
            </Col>
          </Row>
        </Card>
      </div>

      {data.bookingSeats && data.bookingSeats.length > 0 && (
        <Card
          title={
            <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
              II. Vé đã đặt
            </Text>
          }
          style={{ marginBottom: "24px", width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {data.bookingSeats.map((seatItem) => {
              const seat = seatItem.seat;

              // Tìm tripCar chứa ghế này
              const tripCar = data.trip.tripCars?.find((tc) =>
                tc.car.carSeats?.some((cs) => cs.id === seat.id)
              );

              const car = tripCar?.car;
              const carType = car?.carType;
              return (
                <div
                  key={seatItem.id}
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    position: "relative",
                  }}
                >
                  {/* Trạng thái Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      background:
                        seatItem.status === "BOOKED"
                          ? "rgba(82, 196, 26, 0.95)"
                          : "rgba(24, 144, 255, 0.95)",
                      color: "#fff",
                      fontWeight: "600",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    {seatItem.status === "BOOKED" ? "Đã đặt" : "Chờ xác nhận"}
                  </div>

                  {/* Main Content */}
                  <div
                    style={{
                      background: "#fff",
                      padding: "24px",
                      position: "relative",
                    }}
                  >
                    {/* Header với mã vé */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        paddingBottom: "16px",
                        borderBottom: "2px dashed #e0e0e0",
                      }}
                    >
                      <div>
                        <Text
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            display: "block",
                          }}
                        >
                          Mã vé
                        </Text>
                        <Text
                          strong
                          style={{
                            fontSize: "20px",
                            color: "#667eea",
                            letterSpacing: "1px",
                          }}
                        >
                          {seatItem.code}
                        </Text>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          background: "#f0f5ff",
                          padding: "8px 16px",
                          borderRadius: "8px",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            display: "block",
                          }}
                        >
                          Số ghế
                        </Text>
                        <Text
                          strong
                          style={{ fontSize: "24px", color: "#06498B" }}
                        >
                          {seatItem.seat.seatNumber}
                        </Text>
                      </div>
                    </div>

                    {/* Route Info - Điểm đi và điểm đến */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "24px",
                        position: "relative",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          Điểm đi
                        </Text>
                        <Text
                          strong
                          style={{ fontSize: "18px", color: "#333" }}
                        >
                          {data.trip.route.startLocation}
                        </Text>
                      </div>
                      <div
                        style={{
                          padding: "0 24px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            color: "#999",
                            marginTop: "4px",
                          }}
                        >
                          {car?.code}
                        </Text>
                        <div
                          style={{
                            width: "120px",
                            height: "2px",
                            background:
                              "linear-gradient(to right, #667eea, #764ba2)",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              right: "-6px",
                              top: "-4px",
                              width: "0",
                              height: "0",
                              borderLeft: "8px solid #764ba2",
                              borderTop: "5px solid transparent",
                              borderBottom: "5px solid transparent",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ flex: 1, textAlign: "right" }}>
                        <Text
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          Điểm đến
                        </Text>
                        <Text
                          strong
                          style={{ fontSize: "18px", color: "#333" }}
                        >
                          {data.trip.route.endLocation}
                        </Text>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "16px",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <Text
                          style={{
                            fontSize: "11px",
                            color: "#999",
                            display: "block",
                          }}
                        >
                          Thời gian khởi hành
                        </Text>
                        <Text
                          strong
                          style={{ fontSize: "14px", color: "#333" }}
                        >
                          {formatDateTime(data.trip.departureTime)}
                        </Text>
                      </div>
                      <div>
                        <Text
                          style={{
                            fontSize: "11px",
                            color: "#999",
                            display: "block",
                          }}
                        >
                          Loại xe
                        </Text>
                        <Text
                          strong
                          style={{ fontSize: "14px", color: "#333" }}
                        >
                          {carType?.name}
                        </Text>
                      </div>
                      <div>
                        <Text
                          style={{
                            fontSize: "11px",
                            color: "#999",
                            display: "block",
                          }}
                        >
                          Biển số xe
                        </Text>
                        <Text
                          strong
                          style={{ fontSize: "14px", color: "#333" }}
                        >
                          {car?.licensePlate}
                        </Text>
                      </div>
                      <div>
                        <Text
                          style={{
                            fontSize: "11px",
                            color: "#999",
                            display: "block",
                          }}
                        >
                          Vị trí ghế
                        </Text>
                        <Text
                          strong
                          style={{ fontSize: "14px", color: "#333" }}
                        >
                          {seat?.seatPosition}
                        </Text>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div
                      style={{
                        background: "#f8f9fa",
                        padding: "16px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "#999",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Thông tin khách hàng
                      </Text>
                      <Text
                        strong
                        style={{ fontSize: "15px", display: "block" }}
                      >
                        {data.customer?.name}
                      </Text>
                      <Text style={{ fontSize: "13px", color: "#666" }}>
                        {data.customer?.phone} • {data.customer?.email}
                      </Text>
                    </div>

                    {/* Price Footer */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "16px",
                        borderTop: "2px dashed #e0e0e0",
                      }}
                    >
                      <Text style={{ fontSize: "14px", color: "#666" }}>
                        Tổng giá trị
                      </Text>
                      <Text
                        strong
                        style={{
                          fontSize: "24px",
                          color: "#52c41a",
                          fontWeight: "700",
                        }}
                      >
                        {formatCurrency(seatItem.price)}
                      </Text>
                    </div>
                  </div>

                  {/* Decorative circles on sides */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "20px",
                      height: "20px",
                      background: "#f0f2f5",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "-10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "20px",
                      height: "20px",
                      background: "#f0f2f5",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Action Button */}
      <Row justify="center">
        <Button
          type="default"
          icon={<LeftCircleOutlined />}
          onClick={() => router.back()}
        >
          Thoát
        </Button>
      </Row>
    </div>
  );
};
