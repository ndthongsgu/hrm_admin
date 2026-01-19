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
import type { PaymentMethodDto, PaymentMethodFilter } from "@/dto/paymentMethod.dto";
import {
  useActivatePaymentMethod,
  useDeActivatePaymentMethod,
  usePaginationPaymentMethod,
} from "@/hooks/payment-method";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: PaymentMethodFilter = {
  code: "",
  name: "",
  isDeleted: undefined
};

export default function PaymentMethodPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<PaymentMethodFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<PaymentMethodFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading, refetch } = usePaginationPaymentMethod(pagination);

  const { onDeActivatePaymentMethod } = useDeActivatePaymentMethod();
  const { onActivatePaymentMethod } = useActivatePaymentMethod();

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
      label: "Mã phương thức",
      type: "input",
      placeholder: "Nhập mã phương thức",
      col: 8,
    },
    {
      key: "name",
      label: "Tên phương thức",
      type: "input",
      placeholder: "Nhập tên phương thức",
      col: 8,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: "Hoạt động", value: false },
        { label: "Không hoạt động", value: true },
      ],
      placeholder: "Chọn trạng thái",
      col: 8,
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_METHOD_MANAGER.children.ADD_PAYMENT_METHOD.path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    code: 150,
    name: 200,
    description: 300,
    isDeleted: 150,
  });

  const columns = [
    {
      title: "Mã phương thức",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên phương thức",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description: string) => description || "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 120,
      render: (isDeleted: boolean) => {
        const colorMap = {
          false: "green",
          true: "red",
        };
        const textMap = {
          false: "Hoạt động",
          true: "Không hoạt động",
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
          ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_METHOD_MANAGER.children.DETAIL_PAYMENT_METHOD.path.replace(
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
          ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_METHOD_MANAGER.children.EDIT_PAYMENT_METHOD.path.replace(
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
        !record.isDeleted ?<ActionConfirm
          title="Bạn có chắc muốn ngưng hoạt động phương thức thanh toán này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivatePaymentMethod(record.id);
            refetch();
          }}
        >
          <Button icon={<StopOutlined />} danger />
        </ActionConfirm> : ''
      ),
    },
    {
      key: "activate",
      tooltip: "Kích hoạt",
      showKey: "isCanActivate",
      label: "",
      type: "default",
      render: (record) => (
        record.isDeleted ? <ActionConfirm
          title="Bạn có chắc muốn kích hoạt phương thức thanh toán này?"
          confirmText="Hoạt động"
          onConfirm={async () => {
            await onActivatePaymentMethod(record.id);
            refetch();
          }}
        >
          <Button icon={<PlayCircleOutlined />} />
        </ActionConfirm> : ''
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
    setFilter(newFilters as PaymentMethodFilter);
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

      <TableCustom<PaymentMethodDto>
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
