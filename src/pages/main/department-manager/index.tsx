import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { DepartmentFilter } from "@/dto/department.dto";
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
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: DepartmentFilter = {
  code: "",
  name: "",
  isActive: undefined,
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
    {
      key: "isActive",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Hoạt động", value: true },
        { label: "Không hoạt động", value: false },
      ],
      col: 6,
    },
  ];

  const [columnWidths] = useState<Record<string, number>>({
    code: 120,
    name: 200,
    managerName: 180,
    parentDepartmentName: 180,
    isActive: 120,
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
      title: "Quản lý",
      dataIndex: "managerName",
      key: "managerName",
      width: columnWidths.managerName,
      render: (managerName: string) => managerName || "Chưa có",
    },
    {
      title: "Phòng ban cha",
      dataIndex: "parentDepartmentName",
      key: "parentDepartmentName",
      width: columnWidths.parentDepartmentName,
      render: (parentDepartmentName: string) => parentDepartmentName || "Không có",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: columnWidths.isActive,
      render: (isActive: boolean) => {
        const colorMap = {
          true: "green",
          false: "red",
        };
        const textMap = {
          true: "Hoạt động",
          false: "Không hoạt động",
        };
        return (
          <Row justify={"center"}>
            <Tag
              color={colorMap[isActive as unknown as keyof typeof colorMap]}
            >
              {textMap[isActive as unknown as keyof typeof textMap]}
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
