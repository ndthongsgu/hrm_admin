import { useState } from "react";
import { useRouter } from "@/routes/hooks";
import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import type { TableAction } from "@/components/table/Table";
import Table from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { SalaryAdjustmentDto, SalaryAdjustmentFilter } from "@/dto/payroll.dto";
import { usePaginationSalaryAdjustments, useDeactivateSalaryAdjustment, useActivateSalaryAdjustment, usePayrollPeriodSelectOptions, useEmployeeSelectOptions } from "@/hooks/payroll";
import { useConfirm } from "@/hooks/layout/useConfirm";
import { EditOutlined, EyeOutlined, StopOutlined, CheckCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";

const initFilter: SalaryAdjustmentFilter = {
  payrollPeriodId: "",
  employeeId: "",
  type: "",
  reason: "",
  isTaxable: undefined,
  isNetOnly: undefined,
  isDeleted: false,
};

export default function SalaryAdjustmentManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<SalaryAdjustmentFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<SalaryAdjustmentFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading } = usePaginationSalaryAdjustments(pagination);
  const { onDeactivateSalaryAdjustment } = useDeactivateSalaryAdjustment();
  const { onActivateSalaryAdjustment } = useActivateSalaryAdjustment();
  const { confirm } = useConfirm();
  const { data: payrollPeriodOptions } = usePayrollPeriodSelectOptions();
  const { data: employeeOptions } = useEmployeeSelectOptions();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev: PaginationDto<SalaryAdjustmentFilter>) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "payrollPeriodId",
      label: "Kỳ lương",
      type: "select",
      placeholder: "Chọn kỳ lương",
      options: payrollPeriodOptions?.map((option: any) => ({ label: option.name, value: option.id })) || [],
      col: 6,
    },
    {
      key: "employeeId",
      label: "Nhân viên",
      type: "select",
      placeholder: "Chọn nhân viên",
      options: employeeOptions?.map((option: any) => ({ label: option.name, value: option.id })) || [],
      col: 6,
    },
    {
      key: "type",
      label: "Loại điều chỉnh",
      type: "select",
      placeholder: "Chọn loại",
      options: [
        { label: "Thưởng", value: "BONUS" },
        { label: "Phạt", value: "FINE" },
        { label: "Tạm ứng", value: "ADVANCE" },
        { label: "Trợ cấp BHXH", value: "BHXH_BENEFIT" },
      ],
      col: 6,
    },
    {
      key: "reason",
      label: "Lý do",
      type: "input",
      placeholder: "Nhập lý do",
      col: 6,
    },
    {
      key: "isTaxable",
      label: "Chịu thuế",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
      col: 6,
    },
    {
      key: "isNetOnly",
      label: "Chỉ lương net",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Có", value: true },
        { label: "Không", value: false },
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
    employeeName: 150,
    payrollPeriodName: 150,
    amount: 120,
    type: 120,
    reason: 200,
    isTaxable: 100,
    isNetOnly: 100,
    isDeleted: 120,
    actions: 200,
  });

  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
      width: columnWidths.employeeName,
      render: (name: string, record: SalaryAdjustmentDto) =>
        `${record.employeeCode || ""} - ${name || ""}`.trim(),
    },
    {
      title: "Kỳ lương",
      dataIndex: "payrollPeriodName",
      key: "payrollPeriodName",
      width: columnWidths.payrollPeriodName,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      width: columnWidths.amount,
      render: (amount: number) => {
        const formatted = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount || 0);
        return <span style={{ color: amount >= 0 ? "green" : "red" }}>{formatted}</span>;
      },
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: columnWidths.type,
      render: (type: string) => {
        const typeMap = {
          BONUS: { text: "Thưởng", color: "green" },
          FINE: { text: "Phạt", color: "red" },
          ADVANCE: { text: "Tạm ứng", color: "orange" },
          BHXH_BENEFIT: { text: "Trợ cấp BHXH", color: "blue" },
        };
        const config = typeMap[type as keyof typeof typeMap] || { text: type, color: "default" };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: columnWidths.reason,
      render: (reason: string) => reason || "-",
    },
    {
      title: "Chịu thuế",
      dataIndex: "isTaxable",
      key: "isTaxable",
      width: columnWidths.isTaxable,
      render: (isTaxable: boolean) => (
        <Tag color={isTaxable ? "green" : "red"}>{isTaxable ? "Có" : "Không"}</Tag>
      ),
    },
    {
      title: "Chỉ lương net",
      dataIndex: "isNetOnly",
      key: "isNetOnly",
      width: columnWidths.isNetOnly,
      render: (isNetOnly: boolean) => (
        <Tag color={isNetOnly ? "blue" : "default"}>{isNetOnly ? "Có" : "Không"}</Tag>
      ),
    },
    {
      title: "Trạng thái",
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
        return <Tag color={colorMap[isDeleted ? "true" : "false"]}>{textMap[isDeleted ? "true" : "false"]}</Tag>;
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
      onClick: (record: SalaryAdjustmentDto) => {
        router.push(
          ROUTES.MAIN.PAYROLL_MANAGER.children.SALARY_ADJUSTMENTS.children.DETAIL_SALARY_ADJUSTMENT.path.replace(
            ":id",
            record.id!,
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
      hidden: (record: SalaryAdjustmentDto) => record.isDeleted || false,
      onClick: (record: SalaryAdjustmentDto) => {
        router.push(
          ROUTES.MAIN.PAYROLL_MANAGER.children.SALARY_ADJUSTMENTS.children.EDIT_SALARY_ADJUSTMENT.path.replace(
            ":id",
            record.id!,
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
      hidden: (record: SalaryAdjustmentDto) => record.isDeleted || false,
      onClick: async (record: SalaryAdjustmentDto) => {
        confirm({
          title: "Xác nhận ngừng hoạt động",
          content: `Bạn có chắc chắn muốn ngừng hoạt động điều chỉnh lương cho ${record.employeeName}?`,
          onOk: () => onDeactivateSalaryAdjustment(record.id!),
        });
      },
    },
    {
      key: "activate",
      label: "",
      icon: <CheckCircleOutlined />,
      showKey: "isCanActivate",
      type: "default",
      tooltip: "Kích hoạt lại",
      hidden: (record: SalaryAdjustmentDto) => !record.isDeleted,
      onClick: async (record: SalaryAdjustmentDto) => {
        confirm({
          title: "Xác nhận kích hoạt lại",
          content: `Bạn có chắc chắn muốn kích hoạt lại điều chỉnh lương cho ${record.employeeName}?`,
          onOk: () => onActivateSalaryAdjustment(record.id!),
        });
      },
    },
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev: PaginationDto<SalaryAdjustmentFilter>) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleAddNew = () => {
    router.push(ROUTES.MAIN.PAYROLL_MANAGER.children.SALARY_ADJUSTMENTS.children.ADD_SALARY_ADJUSTMENT.path);
  };

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={setFilter}
        onSearch={handleSearch}
        onClear={() => handleSearch(true)}
      />
      <Table
        data={data}
        columns={columns}
        actions={actions}
        loading={isLoading}
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total,
          showSizeChanger: true,
        }}
        onPageChange={handlePageChange}
        customToolbar={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Thêm mới
          </Button>
        }
      />
    </BaseView>
  );
}