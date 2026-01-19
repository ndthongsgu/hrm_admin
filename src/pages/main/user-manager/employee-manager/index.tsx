import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import ActionConfirm from "@/components/confirm-action";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import RowActions from "@/components/row-action";
import { CommonActions } from "@/components/row-action/CommonAction";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { EmployeeDto, EmployeeFilter } from "@/dto/employee.dto";
import type { RoleDto } from "@/dto/role.dto";
import {
  useActivateEmployee,
  useDeActivateEmployee,
  usePaginationEmployee,
} from "@/hooks/employee";
import { useSelectBoxRoles } from "@/hooks/role";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: EmployeeFilter = {
  code: "",
  name: "",
  email: "",
  phone: "",
  isDeleted: undefined,
  roleIds: [],
  roleFilterMode: "OR",
};

export default function EmployeeManager() {
  const router = useRouter();
  const { data: roles = [] } = useSelectBoxRoles();
  const [filter, setFilter] = useState<EmployeeFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<EmployeeFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading, refetch } = usePaginationEmployee(pagination);

  const { onDeActivateEmployee } = useDeActivateEmployee();
  const { onActivateEmployee } = useActivateEmployee();

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
    // ... existing fields ...
    {
      key: "code",
      label: "Mã nhân viên",
      type: "input",
      placeholder: "Nhập mã nhân viên",
      col: 6,
    },
    {
      key: "name",
      label: "Tên nhân viên",
      type: "input",
      placeholder: "Nhập tên nhân viên",
      col: 6,
    },
    {
      key: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
      col: 6,
    },
    {
      key: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập số điện thoại",
      col: 6,
    },
    {
      key: "roleIds",
      label: "Vai trò",
      type: "multiSelect",
      placeholder: "Chọn vai trò",
      options: roles.map((role) => ({
        label: role.name,
        value: role.id,
      })),
      col: 6,
    },
    {
      key: "roleFilterMode",
      label: "Loại lọc vai trò",
      type: "select",
      placeholder: "Chọn loại lọc",
      options: [
        { label: "Có bất kỳ vai trò (OR)", value: "OR" },
        { label: "Có tất cả vai trò (AND)", value: "AND" },
        { label: "Không có vai trò (EXCLUDE)", value: "EXCLUDE" },
      ],
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Hoạt động", value: false },
        { label: "Không hoạt động", value: true },
      ],
      col: 6,
    },
  ];

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children.ADD_EMPLOYEE
        .path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    code: 120,
    name: 200,
    email: 200,
    phone: 150,
    isDeleted: 120,
    actions: 120,
  });

  const columns = [
    // ... existing columns ...
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: columnWidths.code,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "name",
      width: columnWidths.name,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: columnWidths.email,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: columnWidths.phone,
    },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      width: 200,
      render: (roles: RoleDto[]) => (
        <div>
          {roles?.slice(0, 2).map((role) => (
            <Tag key={role.id} color="blue" style={{ marginBottom: "2px" }}>
              {role.name}
            </Tag>
          ))}
          {roles && roles.length > 2 && <Tag>+{roles.length - 2} more</Tag>}
        </div>
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
          true: "Không hoạt động",
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
          ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children.DETAIL_EMPLOYEE.path.replace(
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
          ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children.EDIT_EMPLOYEE.path.replace(
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
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn ngưng hoạt động nhân viên này?"
          confirmText="Ngưng hoạt động"
          onConfirm={async () => {
            await onDeActivateEmployee(record.id);
            refetch();
          }}
        >
          <Button icon={<StopOutlined />} danger />
        </ActionConfirm>
      ),
    },

    {
      key: "activate",
      tooltip: "Kích hoạt",
      showKey: "isCanActivate",
      label: "",
      type: "default",
      render: (record) => (
        <ActionConfirm
          title="Bạn có chắc muốn kích hoạt nhân viên này?"
          confirmText="Hoạt động"
          onConfirm={async () => {
            await onActivateEmployee(record.id);
            refetch();
          }}
        >
          <Button icon={<PlayCircleOutlined />} />
        </ActionConfirm>
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

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as EmployeeFilter);
  };

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        onClear={() => {
          handleSearch(true);
        }}
      />

      <TableCustom<EmployeeDto>
        columns={columns}
        columnWidths={columnWidths}
        data={data}
        loading={isLoading}
        actions={actions}
        actionsWidth={columnWidths.actions}
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
    </BaseView>
  );
}
