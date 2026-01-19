import { ROUTES } from "@/common/constants/routes";
import { formatCurrency, formatDateTime } from "@/common/helpers/format";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import {
  PaymentStatusColors,
  PaymentStatusLabels,
  type PaymentDto,
  type PaymentFilter,
  type PaymentStatusType,
} from "@/dto/payment.dto";
import type { PaginationDto } from "@/dto/pagination.dto";
import {
  usePaginationPayment,
  useUpdatePaymentStatus,
} from "@/hooks/payment";
import { useSelectBookings } from "@/hooks/booking";
import { useSelectPaymentMethods } from "@/hooks/payment-method";
import { useRouter } from "@/routes/hooks";
import {
  EyeOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Modal, Select, Tag, message } from "antd";
import { useMemo, useState } from "react";

const initFilter: PaymentFilter = {};

export default function PaymentManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<PaymentFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<PaymentFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] =
    useState<PaymentStatusType>("PENDING");

  const { data: bookings } = useSelectBookings();
  const { data: paymentMethods } = useSelectPaymentMethods();

  const { data, total, isLoading } = usePaginationPayment(pagination);
  const { onUpdatePaymentStatus, isLoading: isUpdatingStatus } =
    useUpdatePaymentStatus();

  const bookingMap = useMemo(() => {
    return new Map(
      bookings.map((b: any) => [b.id, b])
    );
  }, [bookings]);

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "transactionCode",
      label: "Mã giao dịch",
      type: "input",
      placeholder: "Nhập mã giao dịch",
      col: 8,
    },
    {
      key: "bookingId",
      label: "Mã vé",
      type: "select",
      options: bookings.map((b) => ({
        label: `${b.code} - ${b?.customerName || "N/A"}`,
        value: b.id,
      })),
      placeholder: "Chọn mã vé",
      col: 8,
    },
    {
      key: "methodId",
      label: "Phương thức thanh toán",
      type: "select",
      options: paymentMethods.map((m) => ({
        label: m.name,
        value: m.id,
      })),
      placeholder: "Chọn phương thức",
      col: 8,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: "" },
        { label: "Chờ xử lý", value: "PENDING" },
        { label: "Thành công", value: "SUCCESS" },
        { label: "Thất bại", value: "FAILED" },
        { label: "Đã hoàn tiền", value: "REFUNDED" },
      ],
      col: 8,
    },
  ];

  const handleViewDetail = (record: PaymentDto) => {
    router.push(
      ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_LIST.children.DETAIL_PAYMENT.path.replace(
        ":id",
        record.id
      )
    );
  };

  const handleUpdateStatus = (record: PaymentDto) => {
    setSelectedPayment(record);
    setSelectedStatus(record.status);
    setStatusModalVisible(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedPayment) return;

    try {
      await onUpdatePaymentStatus({
        id: selectedPayment.id,
        status: { status: selectedStatus },
      });
      setStatusModalVisible(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handlePrintInvoice = (record: PaymentDto) => {
    if (!record.invoice) {
      message.warning("Không có hóa đơn để in!");
      return;
    }

    // Open print dialog
    const printWindow = window.open(record.invoice.fileUrl, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleDownloadInvoice = (record: PaymentDto) => {
    if (!record.invoice) {
      message.warning("Không có hóa đơn để tải!");
      return;
    }

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = record.invoice.fileUrl;
    link.download = `invoice_${record.invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Đang tải hóa đơn...");
  };

  const [columnWidths] = useState<Record<string, number>>({
    transactionCode: 150,
    bookingCode: 120,
    customerName: 180,
    method: 150,
    amount: 150,
    status: 130,
    paidAt: 180,
    invoiceNumber: 150,
  });

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "transactionCode",
      key: "transactionCode",
      width: columnWidths.transactionCode,
      render: (text: string) => text || "N/A",
    },
    {
      title: "Mã đặt xe",
      key: "bookingCode",
      render: (record: PaymentDto) => {
        const booking: any = bookingMap.get(record.bookingId);
        return booking?.code || "N/A";
      },
      width: columnWidths.bookingCode,
    },
    {
      title: "Khách hàng",
      key: "customerName",
      render: (record: PaymentDto) => {
        const booking: any = bookingMap.get(record.bookingId);
        // BookingSelectResponse trả customerName, BookingDto trả customer.name
        return (
          booking?.customer?.name || booking?.customerName || "N/A"
        );
      },
      width: columnWidths.customerName,
    },
    {
      title: "Phương thức",
      key: "method",
      render: (record: PaymentDto) => record.method?.name || "N/A",
      width: columnWidths.method,
    },
    {
      title: "Số tiền",
      key: "amount",
      render: (record: PaymentDto) => formatCurrency(record.amount),
      width: columnWidths.amount,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (record: PaymentDto) => (
        <Tag color={PaymentStatusColors[record.status]}>
          {PaymentStatusLabels[record.status]}
        </Tag>
      ),
      width: columnWidths.status,
    },
    {
      title: "Thời gian thanh toán",
      key: "paidAt",
      render: (record: PaymentDto) => formatDateTime(record.paidAt),
      width: columnWidths.paidAt,
    },
    {
      title: "Số hóa đơn",
      key: "invoiceNumber",
      render: (record: PaymentDto) => record.invoice?.invoiceNumber || "N/A",
      width: columnWidths.invoiceNumber,
    },
  ];

  const actions: TableAction[] = [
    {
      key: "view",
      label: "",
      icon: <EyeOutlined />,
      type: "default",
      tooltip: "Xem chi tiết",
      onClick: handleViewDetail,
    },
    {
      key: "updateStatus",
      label: "",
      icon: <EditOutlined />,
      type: "default",
      tooltip: "Cập nhật trạng thái",
      onClick: handleUpdateStatus,
    },
    {
      key: "print",
      label: "",
      icon: <PrinterOutlined />,
      type: "default",
      tooltip: "In hóa đơn",
      onClick: handlePrintInvoice,
      disabled: (record: PaymentDto) => !record.invoice,
    },
    {
      key: "download",
      label: "",
      icon: <FilePdfOutlined />,
      type: "default",
      tooltip: "Tải hóa đơn PDF",
      onClick: handleDownloadInvoice,
      disabled: (record: PaymentDto) => !record.invoice,
    },
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleFiltersChange = (newFilters: Record<string, any>) =>
    setFilter(newFilters as PaymentFilter);

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        onClear={() => handleSearch(true)}
      />
      <TableCustom<PaymentDto>
        columns={columns}
        columnWidths={columnWidths}
        data={data}
        loading={isLoading}
        actions={actions}
        actionsWidth={200}
        pagination={{
          total,
          pageSize: pagination.take,
          current: Math.floor(pagination.skip / pagination.take) + 1,
          showSizeChanger: true,
        }}
        onPageChange={handlePageChange}
      />

      <Modal
        title="Cập nhật trạng thái thanh toán"
        open={statusModalVisible}
        onOk={handleStatusUpdate}
        onCancel={() => {
          setStatusModalVisible(false);
          setSelectedPayment(null);
        }}
        confirmLoading={isUpdatingStatus}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        {selectedPayment && (
          <div style={{ padding: "20px 0" }}>
            <p>
              <strong>Mã giao dịch:</strong>{" "}
              {selectedPayment.transactionCode || "N/A"}
            </p>
            <p>
              <strong>Mã đặt xe:</strong> {selectedPayment.booking?.code}
            </p>
            <p>
              <strong>Số tiền:</strong> {formatCurrency(selectedPayment.amount)}
            </p>
            <div style={{ marginTop: 20 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                <strong>Trạng thái mới:</strong>
              </label>
              <Select
                style={{ width: "100%" }}
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value)}
                options={[
                  { label: "Chờ xử lý", value: "PENDING" },
                  { label: "Thành công", value: "SUCCESS" },
                  { label: "Thất bại", value: "FAILED" },
                  { label: "Đã hoàn tiền", value: "REFUNDED" },
                ]}
              />
            </div>
          </div>
        )}
      </Modal>
    </BaseView>
  );
}
