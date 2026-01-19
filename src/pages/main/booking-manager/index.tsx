import { ROUTES } from "@/common/constants/routes";
import { formatDateTime } from "@/common/helpers/format";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import RowActions from "@/components/row-action";
import { CommonActions } from "@/components/row-action/CommonAction";
import TableCustom, { type TableAction } from "@/components/table/Table";
import {
  BookingStatus,
  BookingStatusColors,
  BookingStatusLabels,
  type BookingDto,
  type BookingFilter,
} from "@/dto/booking.dto";
import type { PaginationDto } from "@/dto/pagination.dto";
import {
  useCompleteTrip,
  useConfirmBooking,
  usePaginationBooking,
  useUpdateBookingStatusByDate,
} from "@/hooks/booking";
import { useSelectCustomers } from "@/hooks/customer";
import { useSelectTrips } from "@/hooks/trip";
import { useRouter } from "@/routes/hooks";
import {
  CheckCircleOutlined,
  CheckOutlined,
  EditOutlined,
  EyeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { useState } from "react";

const initFilter: BookingFilter = {};

export default function BookingManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<BookingFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<BookingFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data: customers } = useSelectCustomers();
  const { data: trips } = useSelectTrips();

  const { data, total, isLoading } = usePaginationBooking(pagination);

  // Booking status action hooks
  const { confirmBooking, isLoading: isConfirming } = useConfirmBooking();
  const { completeTrip, isLoading: isCompleting } = useCompleteTrip();
  const { updateStatusByDate, isLoading: isUpdatingStatus } =
    useUpdateBookingStatusByDate();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã đặt xe",
      type: "input",
      placeholder: "Nhập mã đặt xe",
      col: 8,
    },
    {
      key: "type",
      label: "Loại đặt xe",
      type: "select",
      options: [
        { label: "Tất cả", value: "" },
        { label: "Khứ hồi", value: "ROUNDTRIP" },
        { label: "Một chiều", value: "ONEWAY" },
      ],
      placeholder: "Chọn loại đặt xe",
      col: 8,
    },
    {
      key: "customerId",
      label: "Khách hàng",
      type: "select",
      options: customers.map((c) => ({
        label: c.name,
        value: c.id,
      })),
      placeholder: "Chọn khách hàng",
      col: 8,
    },
    {
      key: "tripId",
      label: "Chuyến đi",
      type: "select",
      options: trips.map((t) => ({
        label: `${t.route.startLocation} → ${t.route.endLocation} (${t.departureTime})`,
        value: t.id,
      })),
      placeholder: "Chọn chuyến đi",
      col: 8,
    },
    {
      key: "bookingStatus",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: "" },
        {
          label: BookingStatusLabels[BookingStatus.NEW],
          value: BookingStatus.NEW,
        },
        {
          label: BookingStatusLabels[BookingStatus.AWAIT_PAYMENT],
          value: BookingStatus.AWAIT_PAYMENT,
        },
        {
          label: BookingStatusLabels[BookingStatus.AWAIT_GO],
          value: BookingStatus.AWAIT_GO,
        },
        {
          label: BookingStatusLabels[BookingStatus.DEPARTING],
          value: BookingStatus.DEPARTING,
        },
        {
          label: BookingStatusLabels[BookingStatus.COMPLETED],
          value: BookingStatus.COMPLETED,
        },
        {
          label: BookingStatusLabels[BookingStatus.CANCELLED],
          value: BookingStatus.CANCELLED,
        },
      ],
      col: 8,
    },
    {
      key: "routeStartLocation",
      label: "Điểm đi",
      type: "input",
      placeholder: "Nhập điểm đi",
      col: 8,
    },
    {
      key: "routeEndLocation",
      label: "Điểm đến",
      type: "input",
      placeholder: "Nhập điểm đến",
      col: 8,
    },
  ];

  const handleCreate = () => {
    router.push(ROUTES.MAIN.BOOKING_MANAGER.children.ADD_BOOKING.path);
  };

  // Booking action handlers
  const handleConfirmBooking = (id: string) => {
    confirmBooking(id);
  };

  const handleCompleteTrip = (id: string) => {
    completeTrip(id);
  };

  const handleUpdateStatus = (id: string) => {
    updateStatusByDate(id);
  };

  const [columnWidths] = useState<Record<string, number>>({
    code: 120,
    customerName: 200,
    routeStartLocation: 200,
    routeEndLocation: 200,
    departureTime: 250,
    bookingStatus: 150,
    totalPrice: 150,
    createdDate: 180,
  });

  const columns = [
    {
      title: "Mã ",
      dataIndex: "code",
      key: "code",
      width: columnWidths.code,
    },
    {
      title: "Khách hàng",
      key: "customerName",
      render: (record: BookingDto) => record.customer.name,
      width: columnWidths.customerName,
    },

    {
      title: "Tuyến đường",
      key: "route",
      render: (record: BookingDto) =>
        `${record.trip.route.startLocation} → ${record.trip.route.endLocation}`,
      width: columnWidths.routeStartLocation + columnWidths.routeEndLocation,
    },
    {
      title: "Thời gian đi",
      key: "departureTime",
      render: (record: BookingDto) => formatDateTime(record.trip.departureTime),
      width: columnWidths.departureTime,
    },
    {
      title: "Trạng thái",
      key: "bookingStatus",
      render: (record: BookingDto) => {
        return (
          <Tag
            color={BookingStatusColors[record.bookingStatus]}
            style={{
              fontSize: "12px",
              padding: "4px 8px",
              borderRadius: "6px",
              fontWeight: "500",
            }}
          >
            <Space size={4}>{BookingStatusLabels[record.bookingStatus]}</Space>
          </Tag>
        );
      },
      width: columnWidths.bookingStatus,
    },
    {
      title: "Tổng tiền",
      key: "totalPrice",
      render: (record: BookingDto) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.totalPrice),
      width: columnWidths.totalPrice,
    },
  ];

  const actions: TableAction[] = [
    {
      key: "confirm",
      label: "",
      icon: <CheckOutlined />,
      type: "primary",
      tooltip: "Xác nhận đặt xe",
      render: (record: BookingDto) => {
        if (record.bookingStatus !== BookingStatus.NEW) return null;
        return (
          <Popconfirm
            title="Xác nhận đặt xe"
            description={`Bạn có chắc chắn muốn xác nhận đặt xe ${
              record.code
            }? Trạng thái sẽ thay đổi thành "${
              BookingStatusLabels[BookingStatus.AWAIT_GO]
            }".`}
            onConfirm={() => handleConfirmBooking(record.id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Tooltip title="Xác nhận đặt xe">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                loading={isConfirming}
                className="bg-green-600 hover:bg-green-700"
              />
            </Tooltip>
          </Popconfirm>
        );
      },
    },
    {
      key: "edit",
      label: "",
      icon: <SyncOutlined />,
      type: "default",
      tooltip: "Cập nhật trạng thái theo ngày",
      render: (record: BookingDto) => {
        if (record.bookingStatus !== BookingStatus.AWAIT_GO) return null;
        return (
          <Popconfirm
            title="Cập nhật trạng thái"
            description={`Cập nhật trạng thái đặt xe ${record.code} dựa trên ngày khởi hành?`}
            onConfirm={() => handleUpdateStatus(record.id)}
            okText="Cập nhật"
            cancelText="Hủy"
          >
            <Tooltip title="Cập nhật trạng thái theo ngày khởi hành">
              <Button
                type="default"
                icon={<SyncOutlined />}
                size="small"
                loading={isUpdatingStatus}
                className="border-blue-400 text-blue-600 hover:border-blue-600 hover:text-blue-700"
              />
            </Tooltip>
          </Popconfirm>
        );
      },
    },
    {
      key: "complete",
      label: "",
      icon: <CheckCircleOutlined />,
      type: "primary",
      tooltip: "Hoàn thành chuyến đi",
      render: (record: BookingDto) => {
        if (record.bookingStatus !== BookingStatus.DEPARTING) return null;
        return (
          <Popconfirm
            title="Hoàn thành chuyến đi"
            description={`Bạn có chắc chắn muốn đánh dấu chuyến đi ${record.code} là hoàn thành?`}
            onConfirm={() => handleCompleteTrip(record.id)}
            okText="Hoàn thành"
            cancelText="Hủy"
          >
            <Tooltip title="Hoàn thành chuyến đi">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="small"
                loading={isCompleting}
                className="bg-purple-600 hover:bg-purple-700"
              />
            </Tooltip>
          </Popconfirm>
        );
      },
    },
    {
      key: "view",
      label: "",
      icon: <EyeOutlined />,
      showKey: "isCanView",
      type: "default",
      tooltip: "Xem chi tiết",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.BOOKING_MANAGER.children.DETAIL_BOOKING.path.replace(
            ":id",
            record.id
          )
        ),
    },
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      showKey: "isCanEdit",
      type: "default",
      tooltip: "Chỉnh sửa",
      disabled: (record: BookingDto) =>
        record.bookingStatus !== BookingStatus.NEW,
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.BOOKING_MANAGER.children.EDIT_BOOKING.path.replace(
            ":id",
            record.id
          )
        ),
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
    setFilter(newFilters as BookingFilter);

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        onClear={() => handleSearch(true)}
      />
      <TableCustom<BookingDto>
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
        customToolbar={
          <RowActions actions={[CommonActions.create(() => handleCreate())]} />
        }
      />
    </BaseView>
  );
}
