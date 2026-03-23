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
import {
  useActivateEmployee,
  useDeActivateEmployee,
  usePaginationEmployee,
} from "@/hooks/employee";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: EmployeeFilter = {
  code: "",
  fullName: "",
  email: "",
  phoneNumber: "",
  isActive: undefined,
};

export default function EmployeeManager() {
  const router = useRouter();
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
    {
      key: "code",
      label: "Mã nhân viên",
      type: "input",
      placeholder: "Nhập mã nhân viên",
      col: 6,
    },
    {
      key: "fullName",
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
      key: "phoneNumber",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập số điện thoại",
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

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children.ADD_EMPLOYEE
        .path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    code: 120,
    fullName: 200,
    email: 200,
    phoneNumber: 150,
    departmentName: 150,
    positionName: 150,
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
      title: "Tên nhân viên",
      dataIndex: "fullName",
      key: "fullName",
      width: columnWidths.fullName,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: columnWidths.email,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: columnWidths.phoneNumber,
    },
    {
      title: "Phòng ban",
      dataIndex: "departmentName",
      key: "departmentName",
      width: columnWidths.departmentName,
    },
    {
      title: "Chức vụ",
      dataIndex: "positionName",
      key: "positionName",
      width: columnWidths.positionName,
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
      key: "knownFace",
      tooltip: "Thêm ảnh nhân viên",
      showKey: "isCanEdit",
      type: "default",
      render: (record) => (
        <Button
          icon={<FileImageOutlined />}
          onClick={() => {
            router.push(
              ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children
                .ADD_KNOWN_FACE.path.replace(":id", record.id)
            );
          }}
        />
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
