import { DAILY_ATTENDANCE_STATUS } from "@/common/constants/payrollPeriod";
import { ROUTES } from "@/common/constants/routes";
import { formatDateTime } from "@/common/helpers/format";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { DailyAttendanceFilter } from "@/dto/payroll.dto";
import { useConfirm } from "@/hooks/layout/useConfirm";
import { usePaginationDailyAttendances } from "@/hooks/payroll/dailyAttendance";
import {
  useDeactivateDailyAttendance,
  useActivateDailyAttendance,
} from "@/hooks/payroll/dailyAttendance";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Button, Row, Space, Tag } from "antd";
import { useState } from "react";

const initFilter: DailyAttendanceFilter = {
  employeeName: "",
  status: undefined,
  isDeleted: false,
  date: undefined,
  dateRange: undefined,
};

export default function DailyAttendanceManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<DailyAttendanceFilter>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<DailyAttendanceFilter>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const { confirm } = useConfirm();

  const { data, total, isLoading } = usePaginationDailyAttendances(pagination);
  const { onDeactivateDailyAttendance } = useDeactivateDailyAttendance();
  const { onActivateDailyAttendance } = useActivateDailyAttendance();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset
        ? initFilter
        : {
            ...prev.where,
            ...filter,
            date: filter.dateRange ? filter.dateRange[0] : undefined,
          },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "employeeName",
      label: "Tên nhân viên",
      type: "input",
      placeholder: "Nhập tên nhân viên",
      col: 6,
    },
    {
      key: "dateRange",
      label: "Ngày chấm công",
      type: "dateRange",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: Object.values(DAILY_ATTENDANCE_STATUS),
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
    employeeName: 200,
    employeeCode: 120,
    date: 120,
    checkInTime: 120,
    checkOutTime: 120,
    status: 120,
    isDeleted: 120,
    actions: 200,
  });

  const columns = [
    {
      title: "Tên nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
      width: columnWidths.employeeName,
      render: (_: any, record: any) => (
        <span>
          {record.employee?.fullName}
        </span>
      ),
    },
    {
      title: "Mã nhân viên",
      dataIndex: "employeeCode",
      key: "employeeCode",
      width: columnWidths.employeeCode,
      render: (_: any, record: any) => (
        <span>
          {record.employee?.employeeCode}
        </span>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: columnWidths.date,
      render: (date: string) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("vi-VN");
      },
    },
    {
      title: "Giờ vào",
      dataIndex: "checkInTime",
      key: "checkInTime",
      width: columnWidths.checkInTime,
      render: (time: string) => formatDateTime(time) || "-",
    },
    {
      title: "Giờ ra",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      width: columnWidths.checkOutTime,
      render: (time: string) => formatDateTime(time) || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: columnWidths.status,
      render: (status: string) => {
        const statusObj = Object.values(DAILY_ATTENDANCE_STATUS).find(
          (s) => s.value === status
        );
        return (
          <Row justify={"center"}>
            <Tag color={statusObj?.color}>{statusObj?.label}</Tag>
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
          ROUTES.MAIN.PAYROLL_MANAGER.children.DAILY_ATTENDANCES.children.DETAIL_DAILY_ATTENDANCE.path.replace(
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
      hidden: (record) => record.isDeleted,
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.PAYROLL_MANAGER.children.DAILY_ATTENDANCES.children.EDIT_DAILY_ATTENDANCE.path.replace(
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
      hidden: (record) => record.isDeleted !== false,
      onClick: async (record) => {
        confirm({
          title: "Xác nhận ngừng hoạt động",
          content: `Bạn có chắc chắn muốn ngừng hoạt động chấm công của ${record.employeeName}?`,
          onOk: async () => {
            await onDeactivateDailyAttendance(record.id);
          },
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
      hidden: (record) => record.isDeleted !== true,
      onClick: async (record) => {
        await onActivateDailyAttendance(record.id);
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
      ROUTES.MAIN.PAYROLL_MANAGER.children.DAILY_ATTENDANCES.children
        .ADD_DAILY_ATTENDANCE.path,
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
          Thêm chấm công
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