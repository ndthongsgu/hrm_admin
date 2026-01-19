import SteeringWheel from "@/assets/icons/steering_wheel.svg";
import type { CarSeatDto } from "@/dto/carSeat.dto";
import { Card, Space, Tag, Typography } from "antd";
import React from "react";

const { Title, Text } = Typography;

interface SeatSelectorProps {
  seats: CarSeatDto[];
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  reservedSeats?: string[];
  heldSeats?: string[];
  bookedSeats?: string[];
}

export default function SeatSelector({
  seats,
  value = [],
  onChange,
  disabled = false,
  reservedSeats = [],
  heldSeats = [],
  bookedSeats = [],
}: SeatSelectorProps) {
  const selectedSeats = Array.isArray(value)
    ? value.filter((v) => typeof v === "string").map((v) => String(v))
    : [];

  const actualHeldSeats = heldSeats.length > 0 ? heldSeats : reservedSeats;
  const actualBookedSeats = bookedSeats;

  if (seats.length === 0 && !disabled) {
    return (
      <Card title="Chọn ghế (8 đã chọn)" style={{ marginTop: 16 }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text>Đang tải dữ liệu ghế...</Text>
        </div>
      </Card>
    );
  }

  // Show disabled state
  if (disabled || seats.length === 0) {
    return (
      <Card title="Chọn ghế" style={{ marginTop: 16 }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="secondary">Vui lòng chọn xe trước</Text>
        </div>
      </Card>
    );
  }

  const sortedSeats = [...seats].sort((a, b) =>
    a.seatNumber.localeCompare(b.seatNumber)
  );

  const SEATS_PER_ROW = 3;
  const totalSeats = sortedSeats.length;
  const desiredHalf = Math.ceil(totalSeats / 2);
  let lowerCount = Math.ceil(desiredHalf / SEATS_PER_ROW) * SEATS_PER_ROW;
  if (lowerCount > totalSeats) lowerCount = totalSeats;

  const lowerFloorSeats = sortedSeats.slice(0, lowerCount);
  const upperFloorSeats = sortedSeats.slice(lowerCount);

  const groupSeatsIntoColumns = (seatList: CarSeatDto[]) => {
    const columns: CarSeatDto[][] = [[], [], []];
    seatList.forEach((seat, idx) => {
      const col = idx % SEATS_PER_ROW;
      columns[col].push(seat);
    });
    return columns;
  };

  const lowerFloor = groupSeatsIntoColumns(lowerFloorSeats);
  const upperFloor = groupSeatsIntoColumns(upperFloorSeats);

  const handleToggleSeat = (seatId: string) => {
    // do not allow toggling a seat that is booked or held by others
    if (disabled) return;
    const seatIdStr = String(seatId);
    if (actualBookedSeats.includes(seatIdStr)) return; // Cannot select booked seats
    if (
      actualHeldSeats.includes(seatIdStr) &&
      !selectedSeats.includes(seatIdStr)
    )
      return; // Cannot select held seats

    const newSelected = selectedSeats.includes(seatIdStr)
      ? selectedSeats.filter((s) => s !== seatIdStr)
      : [...selectedSeats, seatIdStr];
    onChange?.(newSelected);
  };

  const getSeatStatus = (
    seatId: string
  ): "selected" | "booked" | "held" | "available" => {
    const seatIdStr = String(seatId);
    if (selectedSeats.includes(seatIdStr)) return "selected";
    if (actualBookedSeats.includes(seatIdStr)) return "booked";
    if (actualHeldSeats.includes(seatIdStr)) return "held";
    return "available";
  };

  const Seat = ({ seat }: { seat: CarSeatDto }) => {
    const status = getSeatStatus(seat.id);
    const style: React.CSSProperties = {
      width: 40,
      height: 40,
      borderRadius: 8,
      margin: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 500,
      cursor: disabled ? "not-allowed" : "pointer",
      background:
        status === "available"
          ? "#E6F7FF" // Light blue for available
          : status === "selected"
          ? "#1890FF" // Blue for selected
          : status === "held"
          ? "#FAAD14" // Orange for held (temporarily reserved)
          : status === "booked"
          ? "#F5222D" // Red for booked (permanently taken)
          : "#F5F5F5", // Gray fallback
      color: status === "selected" ? "#fff" : "#595959",
      opacity: disabled || status === "booked" || status === "held" ? 0.6 : 1,
      border: "2px solid #ccc",
      transition: "all 0.2s ease",
    };
    return (
      <div
        style={style}
        onClick={() => handleToggleSeat(seat.id)}
        role="button"
        aria-disabled={disabled || status === "booked" || status === "held"}
      >
        {seat.seatNumber}
      </div>
    );
  };

  const renderFloor = (floor: CarSeatDto[][], isLower: boolean) => (
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
            key={`column-${colIndex}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {column.map((seat) => (
              <Seat key={`seat-${seat.id}`} seat={seat} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card
      title={
        <Space>
          <Title level={5} style={{ margin: 0 }}>
            Chọn ghế ({selectedSeats.length} đã chọn)
          </Title>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <Space>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#E6F7FF",
              border: "2px solid #ccc",
              borderRadius: 4,
            }}
          />
          <Text>Có thể chọn</Text>
        </Space>
        <Space>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#1890FF",
              border: "2px solid #1890FF",
              borderRadius: 4,
            }}
          />
          <Text>Đã chọn</Text>
        </Space>
        <Space>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#FAAD14",
              border: "2px solid #d48806",
              borderRadius: 4,
            }}
          />
          <Text>Đã giữ (tạm thời)</Text>
        </Space>
        <Space>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "#F5222D",
              border: "2px solid #F5222D",
              borderRadius: 4,
            }}
          />
          <Text>Đã đặt</Text>
        </Space>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>{renderFloor(lowerFloor, true)}</div>
        <div style={{ marginTop: 40 }}>{renderFloor(upperFloor, false)}</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Text strong>Ghế đã chọn: </Text>
        {selectedSeats.length > 0 ? (
          <Space wrap>
            {selectedSeats.map((seatId, index) => {
              const seat = seats.find((s) => s.id === String(seatId));
              const key = `selected-${String(seatId)}-${index}`;
              return (
                <Tag key={key} color="blue">
                  {seat?.seatNumber || String(seatId)}
                </Tag>
              );
            })}
          </Space>
        ) : (
          <Text type="secondary">Chưa chọn ghế nào</Text>
        )}
      </div>
    </Card>
  );
}
