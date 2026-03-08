import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import { usePaginationAttendanceSummaries, useApproveAttendance, usePayrollPeriodSelectOptions } from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Row, Space, Tag } from "antd";
import { useState } from "react";

const initFilter = {
  payrollPeriodId: "",
  isApproved: undefined,
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

  const { data, total, isLoading } = usePaginationAttendanceSummaries(pagination);
  const { onApproveAttendance } = useApproveAttendance("");
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
      options: payrollPeriodOptions?.map(option => ({ label: option.name, value: option.id })) || [],
      col: 6,
    },
    {
      key: "isApproved",
      label: "Trạng thái duyệt",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Đã duyệt", value: true },
        { label: "Chưa duyệt", value: false },
      ],
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
    isApproved: 120,
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
      title: "Trạng thái duyệt",
      dataIndex: "isApproved",
      key: "isApproved",
      width: columnWidths.isApproved,
      render: (isApproved: boolean) => {
        const colorMap = {
          true: "green",
          false: "gold",
        };
        const textMap = {
          true: "Đã duyệt",
          false: "Chưa duyệt",
        };
        return (
          <Row justify={"center"}>
            <Tag color={colorMap[isApproved ? "true" : "false"]}>
              {textMap[isApproved ? "true" : "false"]}
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
      hidden: (record) => record.isApproved,
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
      icon: <CheckCircleOutlined />,
      showKey: "isCanApprove",
      type: "default",
      tooltip: "Tính lại",
      hidden: (record) => record.isApproved,
      onClick: async (record) => {
        await onApproveAttendance(record.id);
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
