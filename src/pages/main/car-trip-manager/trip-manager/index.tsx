import { ROUTES } from "@/common/constants/routes";
import { formatCurrency, formatDateTime } from "@/common/helpers/format";
import BaseView from "@/components/base-view/BaseView";
import ActionConfirm from "@/components/confirm-action";
import PickupStopForm from "@/components/custom/PickTripStop";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import RowActions from "@/components/row-action";
import { CommonActions } from "@/components/row-action/CommonAction";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { TripDto, TripFilter } from "@/dto/trip.dto";
import { useSelectRoutes } from "@/hooks/route";
import {
  useActivateTrip,
  useDeActivateTrip,
  usePaginationTrip,
} from "@/hooks/trip";
import {
  useCreateTripStop,
  useDeleteTripStop,
  useTripStopsByTrip,
  useUpdateTripStop,
} from "@/hooks/trip-stop";
import { useRouter } from "@/routes/hooks";

import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, List, Modal, Row, Spin, Tag } from "antd";
import { useState } from "react";

const initFilter: TripFilter = {
  routeId: undefined,
  departureTime: undefined,
  price: undefined,
  isDeleted: undefined,
};

export default function TripManager() {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);
  const [filter, setFilter] = useState<TripFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<TripFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const { data, total, isLoading, refetch } = usePaginationTrip(pagination);

  const { onDeActivateTrip } = useDeActivateTrip();
  const { onActivateTrip } = useActivateTrip();

  const { onCreateTripStop, isLoading: isCreateTripStop } = useCreateTripStop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripDto | null>(null);
  const [editingStop, setEditingStop] = useState<any>(null);

  const { data: routes } = useSelectRoutes();

  const {
    data: tripStops,
    isLoading: isLoadingStops,
    refetch: refetchStops,
  } = useTripStopsByTrip(selectedTrip?.id || "");

  // Hook update với id động
  const { onUpdateTripStop, isLoading: isUpdatingStop } = useUpdateTripStop(
    editingStop?.id || ""
  );

  const { onDeleteTripStop } = useDeleteTripStop();

  const handleOpenModal = (trip: TripDto) => {
    setSelectedTrip(trip);
    setEditingStop(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
    setEditingStop(null);
  };

  const handleEditStop = (stop: any) => {
    setEditingStop(stop);
    setFormKey((prev) => prev + 1);
  };

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      where: isReset
        ? initFilter
        : {
            ...prev.where,
            ...filter,
          },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "routeId",
      label: "Tuyến đường",
      type: "select",
      options: routes?.map((route) => ({
        label: route.startLocation + " - " + route.endLocation,
        value: route.id,
      })),
      placeholder: "Chọn tuyến đường",
      col: 6,
    },
    {
      key: "departureTime",
      label: "Thời gian khởi hành",
      type: "datetime",
      placeholder: "Nhập thời gian khởi hành",
      col: 6,
    },
    {
      key: "price",
      label: "Giá vé",
      type: "number",
      col: 6,
      placeholder: "Nhập giá vé",
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      col: 6,
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Hoạt động", value: false },
        { label: "Không hoạt động", value: true },
      ],
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.CAR_TRIP_MANAGER.children.TRIP_MANAGER.children.ADD_TRIP.path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    route: 200,
    departureTime: 180,
    price: 150,
    tripCars: 200,
  });

  const columns = [
    {
      title: "Tuyến đường",
      dataIndex: "routeId",
      key: "route",
      render: (_: any, record: TripDto) => {
        return record.route.startLocation + " - " + record.route.endLocation;
      },
      width: columnWidths.route,
    },
    {
      title: "Thời gian khởi hành",
      dataIndex: "departureTime",
      key: "departureTime",
      render: (time: string) => formatDateTime(time),
      width: columnWidths.departureTime,
    },
    {
      title: "Giá vé",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatCurrency(price),
      width: columnWidths.price,
    },
    {
      title: "Xe chạy chuyến",
      dataIndex: "tripCars",
      key: "tripCars",
      render: (tripCars: any[]) => {
        if (!tripCars || tripCars.length === 0)
          return "Chuyến này chưa có xe nào chạy";
        return tripCars.map((tc) => tc.car.licensePlate).join(", ");
      },
      width: columnWidths.tripCars,
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 120,
      render: (isDeleted: boolean) => {
        const colorMap = {
          true: "red",
          false: "green",
        };
        const textMap = {
          true: "Không hoạt động",
          false: "Hoạt động",
        };
        return (
          <Row justify={"center"}>
            <Tag
              color={colorMap[isDeleted as unknown as keyof typeof colorMap]}
            >
              {textMap[isDeleted as unknown as keyof typeof textMap]}
            </Tag>
          </Row>
        );
      },
    },
  ];

  const actions: TableAction[] = [
    {
      key: "view",
      label: "",
      icon: <EyeOutlined />,
      showKey: "isCanView",
      type: "default",
      tooltip: "Xem chi tiết",
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.CAR_TRIP_MANAGER.children.TRIP_MANAGER.children.DETAIL_TRIP.path.replace(
            ":id",
            record.id
          )
        );
      },
    },
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      showKey: "isCanEdit",
      type: "default",
      tooltip: "Chỉnh sửa",
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.CAR_TRIP_MANAGER.children.TRIP_MANAGER.children.EDIT_TRIP.path.replace(
            ":id",
            record.id
          )
        );
      },
    },
    {
      key: "pickup-stop",
      label: "",
      icon: <EnvironmentOutlined />,
      showKey: "isCanEdit",
      type: "default",
      tooltip: "Thiết lập điểm đón / điểm dừng",
      onClick: (record) => handleOpenModal(record),
    },
    {
      key: "deActivate",
      tooltip: "Ngưng hoạt động",
      showKey: "isCanDeactivate",
      type: "default",
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn ngưng hoạt động chuyến đi này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateTrip(record.id);
            refetch();
          }}
        >
          <Button icon={<StopOutlined />} danger />
        </ActionConfirm>
      ),
    },
    {
      key: "activate",
      tooltip: "Kích hoạt",
      showKey: "isCanActivate",
      label: "",
      type: "default",
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn kích hoạt chuyến đi này?"
          confirmText="Hoạt động"
          onConfirm={async () => {
            await onActivateTrip(record.id);
            refetch();
          }}
        >
          <Button icon={<PlayCircleOutlined />} />
        </ActionConfirm>
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

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as TripFilter);
  };

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        onClear={() => {
          handleSearch(true);
        }}
      />

      <TableCustom<TripDto>
        columns={columns}
        columnWidths={columnWidths}
        data={data}
        loading={isLoading}
        actions={actions}
        actionsWidth={160}
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

      <Modal
        title="Thiết lập điểm đón / điểm dừng"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={900}
      >
        {selectedTrip ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded">
              <p>
                <b>Tuyến đường:</b> {selectedTrip.route.startLocation} -{" "}
                {selectedTrip.route.endLocation}
              </p>
              <p>
                <b>Thời gian khởi hành:</b>{" "}
                {formatDateTime(selectedTrip.departureTime)}
              </p>
            </div>

            {/* Danh sách điểm dừng hiện có */}
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-3 text-base">
                Danh sách điểm dừng hiện tại
              </h3>
              {isLoadingStops ? (
                <div className="text-center py-4">
                  <Spin />
                </div>
              ) : tripStops && tripStops.length > 0 ? (
                <List
                  dataSource={tripStops}
                  renderItem={(stop: any) => (
                    <List.Item
                      actions={[
                        <Button
                          key="edit"
                          icon={<EditOutlined />}
                          onClick={() => handleEditStop(stop)}
                          size="small"
                          type="primary"
                          ghost
                        >
                          Sửa
                        </Button>,
                        <ActionConfirm
                          key="delete"
                          title="Bạn có chắc muốn xóa điểm dừng này?"
                          confirmText="Xóa"
                          onConfirm={async () => {
                            await onDeleteTripStop(stop.id);
                          }}
                        >
                          <Button icon={<DeleteOutlined />} danger size="small">
                            Xóa
                          </Button>
                        </ActionConfirm>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <div className="flex items-center gap-2">
                            <Tag
                              color={
                                stop.stopType === "PICKUP" ? "blue" : "green"
                              }
                            >
                              {stop.stopType === "PICKUP"
                                ? "Điểm đón"
                                : "Điểm trả"}
                            </Tag>
                            <span className="font-medium">{stop.location}</span>
                          </div>
                        }
                        description={`Thứ tự: ${stop.orderIndex}`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Chưa có điểm dừng nào
                </p>
              )}
            </div>

            {/* Form thêm/sửa điểm dừng */}
            <div className="border rounded p-4 bg-blue-50">
              <h3 className="font-semibold mb-3 text-base">
                {editingStop ? "Chỉnh sửa điểm dừng" : "Thêm điểm dừng mới"}
              </h3>
              <PickupStopForm
                key={formKey}
                initData={
                  editingStop
                    ? {
                        stopType: editingStop.stopType,
                        location: editingStop.location,
                        orderIndex: editingStop.orderIndex,
                        tripId: selectedTrip.id,
                      }
                    : {
                        stopType: "PICKUP",
                        location: "",
                        orderIndex: "",
                        tripId: selectedTrip.id,
                      }
                }
                loading={isCreateTripStop || isUpdatingStop}
                onSubmit={async (data) => {
                  if (editingStop) {
                    // Cập nhật điểm dừng
                    await onUpdateTripStop(data);
                    setEditingStop(null);
                  } else {
                    // Thêm mới điểm dừng
                    const payload = {
                      ...data,
                      tripId: selectedTrip.id,
                    };
                    await onCreateTripStop(payload);
                  }

                  refetchStops();
                  setFormKey((prev) => prev + 1);
                }}
                onCancel={() => {
                  setEditingStop(null);
                  setFormKey((prev) => prev + 1);
                }}
              />
            </div>
          </div>
        ) : (
          <p>Không có dữ liệu chuyến đi.</p>
        )}
      </Modal>
    </BaseView>
  );
}
