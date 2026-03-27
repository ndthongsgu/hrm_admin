import FilterComponent, { type FilterField } from "@/components/filter/FilterCustom";
import Loading from "@/components/loading/Loading";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { TableColumnsType } from "antd";
import { useDeleteEmployeeShiftAssignment, usePaginationEmployeeShiftAssignments } from "@/hooks/employeeShiftAssignment";
import { useRouter } from "@/routes/hooks";
import { useConfirm } from "@/hooks/layout/useConfirm";
import { ROUTES } from "@/common/constants/routes";
import type { EmployeeShiftAssignmentDto, EmployeeShiftAssignmentFilter } from "@/dto/employeeShiftAssignment.dto";
import type { PaginationDto } from "@/dto/base.dto";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import BaseView from "@/components/base-view/BaseView";
import { useState } from "react";

const initFilter: EmployeeShiftAssignmentFilter = {
  employeeCode: "",
  employeeName: "",
  shiftName: "",
};

export default function EmployeeShiftAssignmentManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<EmployeeShiftAssignmentFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<EmployeeShiftAssignmentFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const { confirm } = useConfirm();

  const { data, total, isLoading } = usePaginationEmployeeShiftAssignments(pagination);

  const handleSearch = (isReset?: boolean) => {
    if (isReset) {
      setFilter(initFilter);
      setPagination({
        skip: 0,
        take: 10,
        where: initFilter,
      });
    } else {
      setPagination({
        ...pagination,
        skip: 0,
        where: filter,
      });
    }
  };

  const filterFields: FilterField[] = [
    {
      key: "employeeCode",
      label: "Mã nhân viên",
      type: "input",
      placeholder: "Nhập mã nhân viên",
      col: 8,
    },
    {
      key: "employeeName",
      label: "Tên nhân viên",
      type: "input",
      placeholder: "Nhập tên nhân viên",
      col: 8,
    },
    {
      key: "shiftName",
      label: "Ca làm việc",
      type: "input",
      placeholder: "Nhập tên ca làm việc",
      col: 8,
    },
  ];

  const columns: TableColumnsType<EmployeeShiftAssignmentDto> = [
    {
      title: "Mã nhân viên",
      dataIndex: "employeeCode",
      key: "employeeCode",
      width: 120,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
      width: 200,
    },
    {
      title: "Ca làm việc",
      dataIndex: "shiftName",
      key: "shiftName",
      width: 150,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (startDate: string) => startDate || "-",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: (endDate: string) => endDate || "-",
    },
  ];

  const actions: TableAction[] = [
    {
      key: "view",
      label: "",
      icon: <EyeOutlined />,
      type: "default",
      tooltip: "Xem chi tiết",
      onClick: (record: EmployeeShiftAssignmentDto) => {
        router.push(
          (
            ROUTES.MAIN.PAYROLL_MANAGER.children.EMPLOYEE_SHIFT_ASSIGNMENTS.children
              .DETAIL_EMPLOYEE_SHIFT_ASSIGNMENT.path || ""
          ).replace(":id", record.id ?? "")
        );
      },
    },
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      type: "default",
      tooltip: "Chỉnh sửa",
      onClick: (record: EmployeeShiftAssignmentDto) => {
        router.push(
          (
            ROUTES.MAIN.PAYROLL_MANAGER.children.EMPLOYEE_SHIFT_ASSIGNMENTS.children
              .EDIT_EMPLOYEE_SHIFT_ASSIGNMENT.path || ""
          ).replace(":id", record.id ?? "")
        );
      },
    },
    {
      key: "delete",
      label: "",
      icon: <DeleteOutlined />,
      type: "primary",
      danger: true,
      tooltip: "Xóa",
      onClick: (record: EmployeeShiftAssignmentDto) => {
        confirm({
          title: "Xóa gán ca làm việc",
          content: `Bạn có chắc muốn xóa gán ca làm việc cho nhân viên "${record.employeeName}" không?`,
          onOk: async () => {
            const { onDeleteEmployeeShiftAssignment } = useDeleteEmployeeShiftAssignment(
              record.id ?? ""
            );
            await onDeleteEmployeeShiftAssignment();
          },
        });
      },
    },
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  };

  const handleAddNew = () => {
    router.push(
      ROUTES.MAIN.PAYROLL_MANAGER.children.EMPLOYEE_SHIFT_ASSIGNMENTS.children
        .ADD_EMPLOYEE_SHIFT_ASSIGNMENT.path
    );
  };

  return (
    <BaseView>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <FilterComponent
          fields={filterFields}
          filters={filter}
          onFiltersChange={(changedValues: any) => {
            setFilter({ ...filter, ...changedValues });
          }}
          onSearch={() => handleSearch(false)}
          onClear={() => {
            setFilter(initFilter);
            handleSearch(true);
          }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm gán ca làm việc
        </Button>
        {isLoading ? (
          <Loading />
        ) : (
          <TableCustom
            columns={columns}
            data={data}
            rowKey="id"
            actions={actions}
            pagination={{
              current: Math.floor(pagination.skip / pagination.take) + 1,
              pageSize: pagination.take,
              total: total,
            }}
            onPageChange={handlePageChange}
            scroll={{ x: 1200 }}
          />
        )}
      </Space>
    </BaseView>
  );
}
