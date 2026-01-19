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
import type { CarTypeDto, CarTypeFilter } from "@/dto/carType.dto";
import {
  useActivateCarType,
  useDeActivateCarType,
  usePaginationCarType,
} from "@/hooks/car-type";

import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: CarTypeFilter = {
  code: "",
  name: "",
  isDeleted: undefined,
};

export default function CarTypePage() {
  const router = useRouter();
  const [filter, setFilter] = useState<CarTypeFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<CarTypeFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading, refetch } = usePaginationCarType(pagination);

  const { onDeActivateCarType } = useDeActivateCarType();
  const { onActivateCarType } = useActivateCarType();

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
      label: "Mã loại xe",
      type: "input",
      placeholder: "Nhập mã loại xe",
      col: 8,
    },
    {
      key: "name",
      label: "Tên loại xe",
      type: "input",
      placeholder: "Nhập tên loại xe",
      col: 8,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      col: 8,
      options: [
        { label: "Hoạt động", value: false },
        { label: "Không hoạt động", value: true },
      ],
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children.CAR_TYPE
        .children.ADD_CAR_TYPE.path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    code: 120,
    name: 200,
    email: 200,
    phone: 150,
    createdDate: 180,
  });

  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Tên loại xe",
      dataIndex: "name",
      key: "name",
      width: 200,
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
          ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children.CAR_TYPE.children.DETAIL_CAR_TYPE.path.replace(
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
          ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children.CAR_TYPE.children.EDIT_CAR_TYPE.path.replace(
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
          title="Bạn có chắc muốn ngưng hoạt động loại xe này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateCarType(record.id);
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
          title="Bạn có chắc muốn kích hoạt loại xe này?"
          confirmText="Hoạt động"
          onConfirm={async () => {
            await onActivateCarType(record.id);
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
    setFilter(newFilters as CarTypeFilter);
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

      <TableCustom<CarTypeDto>
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
