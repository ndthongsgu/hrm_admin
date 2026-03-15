import { ATTENDANCE_SUMMARY_STATUS } from "@/common/constants/payrollPeriod";
import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import { usePaginationAttendanceSummaries, useApproveAttendance, useRejectAttendance, usePayrollPeriodSelectOptions } from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Row, Space, Tag, Modal, Input } from "antd";
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

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { data, total, isLoading } = usePaginationAttendanceSummaries(pagination);
  const { onApproveAttendance } = useApproveAttendance();
  const { onRejectAttendance } = useRejectAttendance();
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
      options: payrollPeriodOptions?.map((option: any) => ({ label: option.name, value: option.id })) || [],
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
            <Tag color={ATTENDANCE_SUMMARY_STATUS[status as keyof typeof ATTENDANCE_SUMMARY_STATUS]?.color}>
              {ATTENDANCE_SUMMARY_STATUS[status as keyof typeof ATTENDANCE_SUMMARY_STATUS]?.label}
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
      hidden: (record) => record.status === ATTENDANCE_SUMMARY_STATUS.APPROVED.value,
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
      hidden: (record) => record.status !== ATTENDANCE_SUMMARY_STATUS.PENDING.value,
      onClick: async (record) => {
        await onApproveAttendance(record.id);
      },
    },
    {
      key: "reject",
      label: "",
      icon: <CloseOutlined />,
      showKey: "isCanReject",
      type: "default",
      tooltip: "Từ chối duyệt",
      hidden: (record) => record.status !== ATTENDANCE_SUMMARY_STATUS.PENDING.value,
      onClick: async (record) => {
        setSelectedRecord(record);
        setRejectReason("");
        setRejectModalVisible(true);
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

      <Modal
        title="Xác nhận từ chối duyệt công"
        open={rejectModalVisible}
        onOk={() => {
          if (selectedRecord) {
            onRejectAttendance({ id: selectedRecord.id, reason: rejectReason });
            setRejectModalVisible(false);
            setRejectReason("");
            setSelectedRecord(null);
          }
        }}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason("");
          setSelectedRecord(null);
        }}
        okText="Từ chối"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: "12px" }}>
          Bạn có chắc chắn muốn từ chối duyệt công cho <strong>{selectedRecord?.employeeName}</strong> - Kỳ <strong>{selectedRecord?.payrollPeriodName}</strong>?
        </div>
        <div style={{ marginBottom: "8px" }}>Lý do từ chối:</div>
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do từ chối..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </BaseView>
  );
}
