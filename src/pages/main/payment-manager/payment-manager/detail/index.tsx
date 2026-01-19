import { formatCurrency, formatDateTime } from "@/common/helpers/format";
import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import {
  PaymentStatusColors,
  PaymentStatusLabels,
  type PaymentDto,
} from "@/dto/payment.dto";
import { useDetailBooking } from "@/hooks/booking";
import { useDetailPayment } from "@/hooks/payment";
import { useRouter } from "@/routes/hooks";
import {
  LeftCircleOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography, message } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function PaymentDetail() {
  const { id } = useParams();
  const paymentId = id as string;
  const { data, isLoading } = useDetailPayment(paymentId);
  const bookingId = data?.bookingId ?? "";
  const { data: booking } = useDetailBooking(bookingId);
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title>Chi tiết giao dịch thanh toán</Title>
        <Button
          type="default"
          icon={<LeftCircleOutlined />}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </div>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết",
            key: "1",
            children: data ? <DetailView data={data} booking={booking} /> : <Loading />,
          },
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: (
              <ActionLogView functionType="Payments" functionId={id ?? ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data, booking }: { data: PaymentDto; booking?: any }) => {
  const handlePrintInvoice = () => {
    if (!data.invoice) {
      message.warning("Không có hóa đơn để in!");
      return;
    }

    const printWindow = window.open(data.invoice.fileUrl, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleDownloadInvoice = () => {
    if (!data.invoice) {
      message.warning("Không có hóa đơn để tải!");
      return;
    }

    const link = document.createElement("a");
    link.href = data.invoice.fileUrl;
    link.download = `invoice_${data.invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Đang tải hóa đơn...");
  };

  return (
    <div style={{ padding: "16px 0" }}>
      {/* Payment Information */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin giao dịch
          </Text>
        }
        style={{ marginBottom: "24px" }}
        extra={
          data.invoice && (
            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                type="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrintInvoice}
              >
                In hóa đơn
              </Button>
              <Button
                type="default"
                icon={<FilePdfOutlined />}
                onClick={handleDownloadInvoice}
              >
                Tải PDF
              </Button>
            </div>
          )
        }
      >
        <Row gutter={[24, 24]}>
          <Col span={8} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Mã giao dịch
            </Text>
            <Text strong>{data.transactionCode || "N/A"}</Text>
          </Col>

          <Col span={8} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Số tiền
            </Text>
            <Text strong style={{ fontSize: "16px", color: "#52c41a" }}>
              {formatCurrency(data.amount)}
            </Text>
          </Col>

          <Col span={8} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Trạng thái
            </Text>
            <Tag color={PaymentStatusColors[data.status]} style={{ fontSize: "14px" }}>
              {PaymentStatusLabels[data.status]}
            </Tag>
          </Col>

          <Col span={12} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Phương thức thanh toán
            </Text>
            <Text strong>{data.method?.name || "N/A"}</Text>
          </Col>

          <Col span={12} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Thời gian thanh toán
            </Text>
            <Text strong>{formatDateTime(data.paidAt)}</Text>
          </Col>
        </Row>
      </Card>

      {/* Booking Information */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            II. Thông tin đặt xe
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[24, 24]}>
          <Col span={8} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Mã đặt xe
            </Text>
            <Text strong>{booking?.code || "N/A"}</Text>
          </Col>

          <Col span={8} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Khách hàng
            </Text>
            <Text strong>{booking?.customer?.name || "N/A"}</Text>
          </Col>

          <Col span={8} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Số điện thoại
            </Text>
            <Text strong>{booking?.customer?.phone || "N/A"}</Text>
          </Col>

          <Col span={12} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Email
            </Text>
            <Text strong>{booking?.customer?.email || "N/A"}</Text>
          </Col>

          <Col span={12} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Loại khách hàng
            </Text>
            <Text strong>
              {booking?.customer?.customerType?.name || "N/A"}
            </Text>
          </Col>

          <Col span={12} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Tuyến đường
            </Text>
            <Text strong>
              {booking?.trip?.route?.startLocation || "N/A"} →{" "}
              {booking?.trip?.route?.endLocation || "N/A"}
            </Text>
          </Col>

          <Col span={12} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Thời gian khởi hành
            </Text>
            <Text strong>
              {booking?.trip?.departureTime
                ? formatDateTime(booking.trip.departureTime)
                : "N/A"}
            </Text>
          </Col>

          <Col span={12} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Tổng tiền đặt xe
            </Text>
            <Text strong>
              {booking?.totalPrice
                ? formatCurrency(booking.totalPrice)
                : "N/A"}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Invoice Information */}
      {data.invoice && (
        <Card
          title={
            <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
              III. Thông tin hóa đơn
            </Text>
          }
          style={{ marginBottom: "24px" }}
        >
          <Row gutter={[24, 24]}>
            <Col span={12} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Số hóa đơn
              </Text>
              <Text strong>{data.invoice.invoiceNumber}</Text>
            </Col>

            <Col span={12} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                Ngày phát hành
              </Text>
              <Text strong>{formatDateTime(data.invoice.issuedAt)}</Text>
            </Col>

            <Col span={24} style={{ padding: "10px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "14px", display: "block", color: "#06498B" }}
              >
                File URL
              </Text>
              <a
                href={data.invoice.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.invoice.fileUrl}
              </a>
            </Col>
          </Row>
        </Card>
      )}

      {/* Additional Information */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            IV. Thông tin hệ thống
          </Text>
        }
      >
        <Row gutter={[24, 24]}>
          <Col span={8} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Ngày tạo
            </Text>
            <Text strong>{formatDateTime(data.createdDate)}</Text>
          </Col>

          <Col span={8} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Người tạo
            </Text>
            <Text strong>{data.createdBy || "N/A"}</Text>
          </Col>

          <Col span={8} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Ngày cập nhật
            </Text>
            <Text strong>{formatDateTime(data.updatedDate)}</Text>
          </Col>

          <Col span={8} style={{ padding: "10px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Người cập nhật
            </Text>
            <Text strong>{data.updatedBy || "N/A"}</Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
