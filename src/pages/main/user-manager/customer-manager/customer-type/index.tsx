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
import type {
  CustomerTypeDto,
  CustomerTypeFilter,
} from "@/dto/customerType.dto";
import {
  useActivateCustomerType,
  useDeActivateCustomerType,
  usePaginationCustomerType,
} from "@/hooks/customer-type";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: CustomerTypeFilter = {
  code: "",
  name: "",
  isDeleted: undefined,
};

export default function CustomerTypePage() {
  const router = useRouter();
  const [filter, setFilter] = useState<CustomerTypeFilter>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<CustomerTypeFilter>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading, refetch } =
    usePaginationCustomerType(pagination);

  const { onDeActivateCustomerType } = useDeActivateCustomerType();
  const { onActivateCustomerType } = useActivateCustomerType();

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
      label: "Mã loại khách hàng",
      type: "input",
      placeholder: "Nhập mã loại khách hàng",
      col: 8,
    },
    {
      key: "name",
      label: "Tên loại khách hàng",
      type: "input",
      placeholder: "Nhập tên loại khách hàng",
      col: 8,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Hoạt động", value: false },
        { label: "Không hoạt động", value: true },
      ],
      col: 8,
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.CUSTOMER_TYPE
        .children.ADD_CUSTOMER_TYPE.path
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
      title: "Tên loại khách hàng",
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
          ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.CUSTOMER_TYPE.children.DETAIL_CUSTOMER_TYPE.path.replace(
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
          ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.CUSTOMER_TYPE.children.EDIT_CUSTOMER_TYPE.path.replace(
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
          title="Bạn có chắc muốn ngưng hoạt động loại khách hàng này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateCustomerType(record.id);
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
          title="Bạn có chắc muốn kích hoạt loại khách hàng này?"
          confirmText="Hoạt động"
          onConfirm={async () => {
            await onActivateCustomerType(record.id);
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
    setFilter(newFilters as CustomerTypeFilter);
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

      <TableCustom<CustomerTypeDto>
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
