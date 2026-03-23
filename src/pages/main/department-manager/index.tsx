import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { DepartmentDto, DepartmentFilter } from "@/dto/department.dto";
import {
  useActivateDepartment,
  useDeActivateDepartment,
  usePaginationDepartment,
} from "@/hooks/department";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";

const initFilter: DepartmentFilter = {
  code: "",
  name: "",
};

export default function DepartmentManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<DepartmentFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<DepartmentFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading } = usePaginationDepartment(pagination);
  const { onDeActivateDepartment } = useDeActivateDepartment();
  const { onActivateDepartment } = useActivateDepartment();

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
      label: "Mã phòng ban",
      type: "input",
      placeholder: "Nhập mã phòng ban",
      col: 6,
    },
    {
      key: "name",
      label: "Tên phòng ban",
      type: "input",
      placeholder: "Nhập tên phòng ban",
      col: 6,
    },
  ];

  const [columnWidths] = useState<Record<string, number>>({
    code: 120,
    name: 260,
    parentDepartmentName: 240,
    actions: 120,
  });

  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: columnWidths.code,
    },
    {
      title: "Tên phòng ban",
      dataIndex: "name",
      key: "name",
      width: columnWidths.name,
    },
    {
      title: "Phòng ban cha",
      dataIndex: "parent",
      key: "parentDepartmentName",
      width: columnWidths.parentDepartmentName,
      render: (parent: DepartmentDto["parent"]) => parent?.name || "Không có",
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
          ROUTES.MAIN.DEPARTMENT_MANAGER.children.DETAIL_DEPARTMENT.path.replace(
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
          ROUTES.MAIN.DEPARTMENT_MANAGER.children.EDIT_DEPARTMENT.path.replace(
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
      render: () => <Button icon={<StopOutlined />} />,
      onClick: (record) => {
        onDeActivateDepartment(record.id);
      },
    },
    {
      key: "activate",
      tooltip: "Kích hoạt",
      showKey: "isCanActivate",
      label: "",
      type: "default",
      render: () => <Button icon={<PlayCircleOutlined />} />,
      onClick: (record) => {
        onActivateDepartment(record.id);
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
      <h2 style={{ marginBottom: "16px" }}>Danh sách phòng ban</h2>
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
    </BaseView>
  );
}
