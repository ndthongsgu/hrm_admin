import BaseView from "@/components/base-view/BaseView";
import ActionConfirm from "@/components/confirm-action";
import RowActions from "@/components/row-action";
import { CommonActions } from "@/components/row-action/CommonAction";
import TableCustom from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { CarEmployeeDto, CarEmployeeFilter } from "@/dto/carEmployee.dto";
import {
  useDeleteCarEmployee,
  usePaginationCarEmployee,
} from "@/hooks/car-employee";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import CarEmployeeFormModal from "./CarEmployeeFormModal";

const initFilter: CarEmployeeFilter = {};

const roleOptions = [
  { label: "Tài xế", value: "DRIVER" },
  { label: "Phụ xe", value: "ASSISTANT" },
  { label: "Tạp vụ", value: "CLEANER" },
];

export default function CarEmployeeManager() {
  const [pagination, setPagination] = useState<
    PaginationDto<CarEmployeeFilter>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const { data, total, isLoading, refetch } =
    usePaginationCarEmployee(pagination);
  const { onDeleteCarEmployee, isLoading: deleting } = useDeleteCarEmployee();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CarEmployeeDto | null>(null);
  const [columnWidths] = useState<Record<string, number>>({});
  const columns = [
    {
      title: "Xe",
      key: "car",
      width: 200,
      render: (_: any, r: CarEmployeeDto) => r.car?.licensePlate || "",
    },
    {
      title: "Nhân viên",
      key: "employee",
      width: 220,
      render: (_: any, r: CarEmployeeDto) => r.employee?.name || "",
    },
    {
      title: "Vai trò",
      key: "role",
      width: 120,
      render: (_: any, r: CarEmployeeDto) => {
        const role = roleOptions.find((o) => o.value === r.role);
        return role ? role.label : r.role;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 140,
      render: (_: any, record: CarEmployeeDto) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record);
              setOpen(true);
            }}
          />
          <ActionConfirm
            title="Xóa phân công này?"
            confirmText="Xóa"
            onConfirm={async () => {
              await onDeleteCarEmployee(record.id);
              refetch();
            }}
          >
            <Button icon={<DeleteOutlined />} danger />
          </ActionConfirm>
        </div>
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

  const handleCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  return (
    <BaseView isLoading={isLoading || deleting}>
      <TableCustom
        columns={columns}
        columnWidths={columnWidths}
        data={data}
        loading={isLoading}
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

      <CarEmployeeFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => refetch()}
        editing={editing}
      />
    </BaseView>
  );
}
