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
import type { CarDto, CarFilter } from "@/dto/car.dto";
import {
  useActivateCar,
  useDeActivateCar,
  usePaginationCar,
} from "@/hooks/car";
import { useSelectCarTypes } from "@/hooks/car-type";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: CarFilter = {
  code: "",
  licensePlate: "",
  carTypeId: undefined,
  isDeleted: undefined,
};

export default function CarPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<CarFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<CarFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading, refetch } = usePaginationCar(pagination);

  const { data: carTypes } = useSelectCarTypes();

  const { onDeActivateCar } = useDeActivateCar();
  const { onActivateCar } = useActivateCar();

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
      key: "code",
      label: "Mã xe",
      type: "input",
      placeholder: "Nhập mã xe",
      col: 6,
    },
    {
      key: "licensePlate",
      label: "Biển số xe",
      type: "input",
      placeholder: "Nhập biển số xe",
      col: 6,
    },
    {
      key: "carTypeId",
      label: "Loại xe",
      type: "select",
      options: carTypes.map((ct) => ({
        label: ct.name,
        value: ct.id,
      })),
      placeholder: "Chọn loại xe",
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      col: 6,
      options: [
        { label: "Hoạt động", value: false },
        { label: "Không hoạt động", value: true },
      ],
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children.CAR_LIST
        .children.ADD_CAR.path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    code: 150,
    licensePlate: 150,
    carTypeName: 200,
    isDeleted: 150,
  });

  const columns = [
    {
      title: "Mã xe",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },

    {
      title: "Loại xe",
      dataIndex: "carTypeName",
      key: "carTypeName ",
      render: (_: any, record: CarDto) => {
        return record.carType?.name || "";
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
          ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children.CAR_LIST.children.DETAIL_CAR.path.replace(
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
          ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children.CAR_LIST.children.EDIT_CAR.path.replace(
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
          title="Bạn có chắc muốn ngưng hoạt động xe này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateCar(record.id);
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
          title="Bạn có chắc muốn kích hoạt xe này?"
          confirmText="Hoạt động"
          onConfirm={async () => {
            await onActivateCar(record.id);
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
    setFilter(newFilters as CarFilter);
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

      <TableCustom<CarDto>
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
