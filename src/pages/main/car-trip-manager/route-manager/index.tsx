import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import ActionConfirm from "@/components/confirm-action";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import RowActions from "@/components/row-action";
import { CommonActions } from "@/components/row-action/CommonAction";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { RouteDto, RouteFilter } from "@/dto/route.dto";
import {
  useActivateRoute,
  useDeActivateRoute,
  usePaginationRoute,
} from "@/hooks/route";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: RouteFilter = {
  startLocation: undefined,
  endLocation: undefined,
  minDistanceKm: undefined,
  maxDistanceKm: undefined,
  minEstimatedDuration: undefined,
  maxEstimatedDuration: undefined,
  isDeleted: undefined,
};

export default function RouteManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<RouteFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<RouteFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading, refetch } = usePaginationRoute(pagination);

  const { onDeActivateRoute } = useDeActivateRoute();
  const { onActivateRoute } = useActivateRoute();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
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
      key: "startLocation",
      label: "Điểm đi",
      type: "input",
      placeholder: "Nhập điểm đi",
      col: 8,
    },
    {
      key: "endLocation",
      label: "Điểm đến",
      type: "input",
      placeholder: "Nhập điểm đến",
      col: 8,
    },
    {
      key: "distanceRange",
      label: "Khoảng cách (km)",
      type: "numberRange",
      placeholder: "Từ - Đến",
      col: 8,
      rangeKeys: {
        from: "minDistanceKm",
        to: "maxDistanceKm",
      },
    },
    {
      key: "durationRange",
      label: "Thời gian di chuyển (phút)",
      type: "numberRange",
      placeholder: "Từ - Đến",
      col: 8,
      rangeKeys: {
        from: "minEstimatedDuration",
        to: "maxEstimatedDuration",
      },
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      col: 8,
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Hoạt động", value: false },
        { label: "Không hoạt động", value: true },
      ],
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.CAR_TRIP_MANAGER.children.ROUTE_MANAGER.children.ADD_ROUTE
        .path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    id: 100,
    startLocation: 200,
    endLocation: 200,
    distanceKm: 150,
    estimatedDuration: 250,
  });

  const columns = [
    {
      title: "Điểm đi",
      dataIndex: "startLocation",
      key: "startLocation",
      width: 150,
    },
    {
      title: "Điểm đến",
      dataIndex: "endLocation",
      key: "endLocation",
      width: 150,
    },
    {
      title: "Khoảng cách (km)",
      dataIndex: "distanceKm",
      key: "distanceKm",
      width: 100,
      render: (distance: number) => distance?.toFixed(1),
    },
    {
      title: "Thời gian di chuyển",
      dataIndex: "estimatedDuration",
      key: "estimatedDuration",
      width: 150,
      render: (minutes: any) => {
        if (minutes == null) return "-";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h === 0) return `${m} phút`;
        if (m === 0) return `${h} giờ`;
        return `${h} giờ ${m} phút`;
      },
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
          ROUTES.MAIN.CAR_TRIP_MANAGER.children.ROUTE_MANAGER.children.DETAIL_ROUTE.path.replace(
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
          ROUTES.MAIN.CAR_TRIP_MANAGER.children.ROUTE_MANAGER.children.EDIT_ROUTE.path.replace(
            ":id",
            record.id
          )
        );
      },
    },
    {
      key: "deActivate",
      tooltip: "Ngưng hoạt động",
      showKey: "isCanDeactivate",
      type: "default",
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn ngưng hoạt động tuyến đường này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateRoute(record.id);
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
          title="Bạn có chắc muốn kích hoạt tuyến đường này?"
          confirmText="Hoạt động"
          onConfirm={async () => {
            await onActivateRoute(record.id);
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
    setFilter(newFilters as RouteFilter);
  };

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        onClear={() => {
          setFilter(initFilter);
          handleSearch(true);
        }}
      />

      <TableCustom<RouteDto>
        columns={columns}
        columnWidths={columnWidths}
        data={data}
        loading={isLoading}
        actions={actions}
        actionsWidth={120}
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
