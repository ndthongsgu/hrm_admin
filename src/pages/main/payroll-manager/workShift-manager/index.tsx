import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import Loading from "@/components/loading/Loading";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { TableColumnsType } from "antd";
import { useDeleteWorkShift, usePaginationWorkShifts } from "@/hooks/workshift";
import { useRouter } from "@/routes/hooks";
import { useConfirm } from "@/hooks/layout/useConfirm";
import { ROUTES } from "@/common/constants/routes";
import type { WorkShiftDto, WorkShiftFilter } from "@/dto/workshift.dto";
import type { PaginationDto } from "@/dto/base.dto";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";
import BaseView from "@/components/base-view/BaseView";
import { useState } from "react";

const initFilter: WorkShiftFilter = {
  name: "",
  isDeleted: false,
};

export default function WorkShiftManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<WorkShiftFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<WorkShiftFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const { confirm } = useConfirm();

  const { data, total, isLoading } = usePaginationWorkShifts(pagination);

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
      key: "name",
      label: "Tên ca làm việc",
      type: "input",
      placeholder: "Nhập tên ca làm việc",
      col: 8,
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
      col: 8,
    },
  ];

  const columns: TableColumnsType<WorkShiftDto> = [
    {
      title: "Tên ca làm việc",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      width: 150,
      render: (startTime: string) => startTime || "-",
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      width: 150,
      render: (endTime: string) => endTime || "-",
    },
    {
      title: "Thời gian nghỉ",
      dataIndex: "breakStart",
      key: "breakTime",
      width: 150,
      render: (_, record: WorkShiftDto) =>
        record.breakStart && record.breakEnd
          ? `${record.breakStart} - ${record.breakEnd}`
          : "-",
    },
    {
      title: "Dung sai muộn (phút)",
      dataIndex: "lateGraceMinutes",
      key: "lateGraceMinutes",
      width: 150,
      render: (lateGraceMinutes: number) => lateGraceMinutes || 0,
    },
    {
      title: "Dung sai về sớm (phút)",
      dataIndex: "earlyLeaveGraceMinutes",
      key: "earlyLeaveGraceMinutes",
      width: 150,
      render: (earlyLeaveGraceMinutes: number) => earlyLeaveGraceMinutes || 0,
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 150,
      render: (isDeleted: boolean) => (
        <span style={{ color: isDeleted ? "red" : "green" }}>
          {isDeleted ? "Ngừng hoạt động" : "Hoạt động"}
        </span>
      ),
    },
  ];

  const actions: TableAction[] = [
    {
      key: "view",
      label: "",
      icon: <EyeOutlined />,
      type: "default",
      tooltip: "Xem chi tiết",
      onClick: (record: WorkShiftDto) => {
        router.push(
          (
            ROUTES.MAIN.PAYROLL_MANAGER.children.WORK_SHIFTS.children
              .DETAIL_WORK_SHIFT.path || ""
          ).replace(":id", record.id ?? ""),
        );
      },
    },
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      type: "default",
      tooltip: "Chỉnh sửa",
      hidden: (record: WorkShiftDto) => record.isDeleted || false,
      onClick: (record: WorkShiftDto) => {
        router.push(
          (
            ROUTES.MAIN.PAYROLL_MANAGER.children.WORK_SHIFTS.children
              .EDIT_WORK_SHIFT.path || ""
          ).replace(":id", record.id ?? ""),
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
      hidden: (record: WorkShiftDto) => record.isDeleted || false,
      onClick: (record: WorkShiftDto) => {
        confirm({
          title: "Xóa ca làm việc",
          content: `Bạn có chắc muốn xóa ca làm việc "${record.name}" không?`,
          onOk: async () => {
            const { onDeleteWorkShift } = useDeleteWorkShift(record.id ?? "");
            await onDeleteWorkShift();
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
      ROUTES.MAIN.PAYROLL_MANAGER.children.WORK_SHIFTS.children.ADD_WORK_SHIFT
        .path,
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
          Thêm mới ca làm việc
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
