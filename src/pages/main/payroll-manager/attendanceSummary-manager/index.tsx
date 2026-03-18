import { ATTENDANCE_SUMMARY_STATUS } from "@/common/constants/payrollPeriod";
import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import { useConfirm } from "@/hooks/layout/useConfirm";
import {
  usePaginationAttendanceSummaries,
  useApproveAttendance,
  usePayrollPeriodSelectOptions,
  useUnApproveAttendance,
} from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import { EditOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Row, Space, Tag } from "antd";
import { useState } from "react";

const initFilter = {
  payrollPeriodId: "",
  status: undefined,
};

export default function AttendanceSummaryManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<Record<string, any>>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<Record<string, any>>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading } =
    usePaginationAttendanceSummaries(pagination);
  const { onApproveAttendance } = useApproveAttendance();
  const { onUnApproveAttendance } = useUnApproveAttendance();
  const { confirm } = useConfirm();
  const { data: payrollPeriodOptions } = usePayrollPeriodSelectOptions();

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
      key: "payrollPeriodId",
      label: "Kỳ lương",
      type: "select",
      placeholder: "Chọn kỳ lương",
      options:
        payrollPeriodOptions?.map((option: any) => ({
          label: option.name,
          value: option.id,
        })) || [],
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: Object.values(ATTENDANCE_SUMMARY_STATUS),
      col: 6,
    },
  ];

  const [columnWidths] = useState<Record<string, number>>({
    employeeName: 200,
    payrollPeriodName: 180,
    actualWorkingDays: 150,
    paidLeaveDays: 150,
    unpaidLeaveDays: 150,
    overtimeHours: 150,
    status: 120,
    actions: 200,
  });

  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
      width: columnWidths.employeeName,
      render: (name: string, record: any) =>
        `${record.employeeCode || ""} - ${name || ""}`.trim(),
    },
    {
      title: "Kỳ lương",
      dataIndex: "payrollPeriodName",
      key: "payrollPeriodName",
      width: columnWidths.payrollPeriodName,
    },
    {
      title: "Ngày công thực tế",
      dataIndex: "actualWorkingDays",
      key: "actualWorkingDays",
      width: columnWidths.actualWorkingDays,
      render: (days: number) => days || 0,
    },
    {
      title: "Ngày nghỉ có lương",
      dataIndex: "paidLeaveDays",
      key: "paidLeaveDays",
      width: columnWidths.paidLeaveDays,
      render: (days: number) => days || 0,
    },
    {
      title: "Ngày nghỉ không lương",
      dataIndex: "unpaidLeaveDays",
      key: "unpaidLeaveDays",
      width: columnWidths.unpaidLeaveDays,
      render: (days: number) => days || 0,
    },
    {
      title: "Giờ làm thêm",
      dataIndex: "overtimeHours",
      key: "overtimeHours",
      width: columnWidths.overtimeHours,
      render: (hours: number) => hours || 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: columnWidths.status,
      render: (status: string) => {
        return (
          <Row justify={"center"}>
            <Tag
              color={
                ATTENDANCE_SUMMARY_STATUS[
                  status as keyof typeof ATTENDANCE_SUMMARY_STATUS
                ]?.color
              }
            >
              {
                ATTENDANCE_SUMMARY_STATUS[
                  status as keyof typeof ATTENDANCE_SUMMARY_STATUS
                ]?.label
              }
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
          ROUTES.MAIN.PAYROLL_MANAGER.children.ATTENDANCE_SUMMARY.children.DETAIL_ATTENDANCE_SUMMARY.path.replace(
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
      hidden: (record) =>
        record.status === ATTENDANCE_SUMMARY_STATUS.APPROVED.value,
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.PAYROLL_MANAGER.children.ATTENDANCE_SUMMARY.children.EDIT_ATTENDANCE_SUMMARY.path.replace(
            ":id",
            record.id,
          ),
        );
      },
    },
    {
      key: "approve",
      label: "",
      icon: <CheckOutlined />,
      showKey: "isCanApprove",
      type: "default",
      tooltip: "Duyệt công",
      hidden: (record) =>
        record.status !== ATTENDANCE_SUMMARY_STATUS.PENDING.value,
      onClick: async (record) => {
        confirm({
          title: "Xác nhận duyệt",
          content: `Bạn có chắc chắn muốn duyệt công cho ${record.employeeName}?`,
          onOk: async () => {
            await onApproveAttendance(record.id!);
          },
        });
      },
    },
    {
      key: "unApprove",
      label: "",
      icon: <CloseOutlined />,
      showKey: "isCanUnApprove",
      type: "default",
      tooltip: "Hủy duyệt công",
      hidden: (record) =>
        record.isDeleted ||
        record.status !== ATTENDANCE_SUMMARY_STATUS.APPROVED.value,
      onClick: (record) => {
        confirm({
          title: "Xác nhận hủy duyệt công",
          content: `Bạn có chắc chắn muốn hủy duyệt công ${record.employeeName}?`,
          onOk: async () => {
            await onUnApproveAttendance(record.id!);
          },
        });
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
