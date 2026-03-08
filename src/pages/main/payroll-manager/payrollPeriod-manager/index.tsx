import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { PayrollPeriodFilter } from "@/dto/payroll.dto";
import { usePaginationPayrollPeriods } from "@/hooks/payroll";
import {
  useDeactivatePayrollPeriod,
  useActivatePayrollPeriod,
} from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Space, Tag } from "antd";
import { useState } from "react";

const initFilter: PayrollPeriodFilter = {
  name: "",
  isLocked: undefined,
  isDeleted: false,
  startDate: undefined,
  endDate: undefined,
  dateRange: undefined,
};

export default function PayrollPeriodManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<PayrollPeriodFilter>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<PayrollPeriodFilter>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading } = usePaginationPayrollPeriods(pagination);
  const { onDeactivatePayrollPeriod } = useDeactivatePayrollPeriod();
  const { onActivatePayrollPeriod } = useActivatePayrollPeriod();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset
        ? initFilter
        : {
            ...prev.where,
            ...filter,
            startDate: filter.dateRange ? filter.dateRange[0] : undefined,
            endDate: filter.dateRange ? filter.dateRange[1] : undefined,
          },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Tên kỳ lương",
      type: "input",
      placeholder: "Nhập tên kỳ lương",
      col: 6,
    },
    {
      key: "dateRange",
      label: "Kỳ lương trong khoảng",
      type: "dateRange",
      col: 6,
    },
    {
      key: "isLocked",
      label: "Trạng thái chốt",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Đã chốt", value: true },
        { label: "Chưa chốt", value: false },
      ],
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái hoạt động",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Hoạt động", value: false },
        { label: "Ngừng hoạt động", value: true },
      ],
      col: 6,
    },
  ];

  const [columnWidths] = useState<Record<string, number>>({
    name: 200,
    startDate: 150,
    endDate: 150,
    standardWorkingDays: 150,
    isLocked: 120,
    isDeleted: 120,
    actions: 200,
  });

  const columns = [
    {
      title: "Tên kỳ lương",
      dataIndex: "name",
      key: "name",
      width: columnWidths.name,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: columnWidths.startDate,
      render: (date: string) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("vi-VN");
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: columnWidths.endDate,
      render: (date: string) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("vi-VN");
      },
    },
    {
      title: "Số ngày làm việc",
      dataIndex: "standardWorkingDays",
      key: "standardWorkingDays",
      width: columnWidths.standardWorkingDays,
      render: (days: number) => days || 0,
    },
    {
      title: "Trạng thái chốt",
      dataIndex: "isLocked",
      key: "isLocked",
      width: columnWidths.isLocked,
      render: (isLocked: boolean) => {
        const colorMap = {
          true: "gold",
          false: "green",
        };
        const textMap = {
          true: "Đã chốt",
          false: "Chưa chốt",
        };
        return (
          <Row justify={"center"}>
            <Tag color={colorMap[isLocked as unknown as keyof typeof colorMap]}>
              {textMap[isLocked as unknown as keyof typeof textMap]}
            </Tag>
          </Row>
        );
      },
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: columnWidths.isDeleted,
      render: (isDeleted: boolean) => {
        const colorMap = {
          true: "red",
          false: "green",
        };
        const textMap = {
          true: "Ngừng hoạt động",
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
          ROUTES.MAIN.PAYROLL_MANAGER.children.PAYROLL_PERIODS.children.DETAIL_PAYROLL_PERIOD.path.replace(
            ":id",
            record.id,
          ),
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
      hidden: (record) => record.isDeleted || record.isLocked,
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.PAYROLL_MANAGER.children.PAYROLL_PERIODS.children.EDIT_PAYROLL_PERIOD.path.replace(
            ":id",
            record.id,
          ),
        );
      },
    },
    {
      key: "deactivate",
      label: "",
      icon: <StopOutlined />,
      showKey: "isCanDeactivate",
      type: "default",
      tooltip: "Ngừng hoạt động",
      hidden: (record) => record.isDeleted || record.isLocked,
      onClick: async (record) => {
        await onDeactivatePayrollPeriod(record.id);
      },
    },
    {
      key: "activate",
      label: "",
      icon: <CheckCircleOutlined />,
      showKey: "isCanActivate",
      type: "default",
      tooltip: "Kích hoạt lại",
      hidden: (record) => !record.isDeleted,
      onClick: async (record) => {
        await onActivatePayrollPeriod(record.id);
      },
    },
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleAddNew = () => {
    router.push(
      ROUTES.MAIN.PAYROLL_MANAGER.children.PAYROLL_PERIODS.children
        .ADD_PAYROLL_PERIOD.path,
    );
  };

  return (
    <BaseView>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <FilterComponent
          fields={filterFields}
          filters={filter}
          onFiltersChange={setFilter}
          onSearch={() => handleSearch(false)}
          onClear={() => {
            setFilter(initFilter);
            handleSearch(true);
          }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm kỳ lương
        </Button>
        <TableCustom
          data={data}
          columns={columns}
          actions={actions}
          loading={isLoading}
          pagination={{
            current: Math.floor(pagination.skip / pagination.take) + 1,
            pageSize: pagination.take,
            total: total,
          }}
          onPageChange={handlePageChange}
        />
      </Space>
    </BaseView>
  );
}
