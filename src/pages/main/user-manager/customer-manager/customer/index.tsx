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
import type { CustomerDto, CustomerFilter } from "@/dto/customer.dto";
import {
  useActivateCustomer,
  useDeActivateCustomer,
  usePaginationCustomer,
} from "@/hooks/customer";
import { useAllCustomerTypes } from "@/hooks/customer-type";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: CustomerFilter = {
  code: "",
  name: "",
  email: "",
  phone: "",
  customerTypeId: undefined,
  isDeleted: undefined,
};

export default function CustomerPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<CustomerFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<CustomerFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data: customerTypes, isLoading: isLoadingCustomerTypes } =
    useAllCustomerTypes();
  const { data, total, isLoading, refetch } = usePaginationCustomer(pagination);

  const { onDeActivateCustomer } = useDeActivateCustomer();
  const { onActivateCustomer } = useActivateCustomer();

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
      label: "Mã khách hàng",
      type: "input",
      placeholder: "Nhập mã khách hàng",
      col: 6,
    },
    {
      key: "name",
      label: "Tên khách hàng",
      type: "input",
      placeholder: "Nhập tên khách hàng",
      col: 6,
    },
    {
      key: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
      col: 6,
    },
    {
      key: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập số điện thoại",
      col: 6,
    },
    {
      key: "customerTypeId",
      label: "Loại khách hàng",
      type: "select",
      placeholder: "Chọn loại khách hàng",
      options: [
        { label: "Tất cả", value: undefined },
        ...(customerTypes?.map((type) => ({
          label: type.name,
          value: type.id,
        })) || []),
      ],
      col: 6,
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
      col: 6,
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.CUSTOMER_LIST
        .children.ADD_CUSTOMER.path
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
      title: "Mã ",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Loại khách hàng",
      dataIndex: "customerTypeName",
      key: "customerTypeName",
      render: (_: any, record: CustomerDto) => {
        return record.customerType?.name || "";
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
          ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.CUSTOMER_LIST.children.DETAIL_CUSTOMER.path.replace(
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
          ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children.CUSTOMER_LIST.children.EDIT_CUSTOMER.path.replace(
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
          title="Bạn có chắc muốn ngưng hoạt động khách hàng này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateCustomer(record.id);
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
          title="Bạn có chắc muốn kích hoạt khách hàng này?"
          confirmText="Hoạt động"
          onConfirm={async () => {
            await onActivateCustomer(record.id);
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
    setFilter(newFilters as CustomerFilter);
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

      <TableCustom<CustomerDto>
        columns={columns}
        columnWidths={columnWidths}
        data={data}
        loading={isLoading || isLoadingCustomerTypes}
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
