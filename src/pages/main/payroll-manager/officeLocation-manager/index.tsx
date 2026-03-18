import { useState } from "react";
import { useRouter } from "@/routes/hooks";
import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import type { TableAction } from "@/components/table/Table";
import Table from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { OfficeLocationDto, OfficeLocationFilter } from "@/dto/officeLocation.dto";
import {
  usePaginationOfficeLocations,
  useDeactivateOfficeLocation,
  useActivateOfficeLocation,
  useApproveOfficeLocation,
  useUnApproveOfficeLocation,
} from "@/hooks/officeLocation";
import { useConfirm } from "@/hooks/layout/useConfirm";
import { OFFICE_LOCATION_STATUS } from "@/common/constants/payrollPeriod";
import {
  EditOutlined,
  EyeOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Tag } from "antd";

const initFilter: OfficeLocationFilter = {
  name: "",
  address: "",
  status: undefined,
  isDeleted: false,
};

export default function OfficeLocationManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<OfficeLocationFilter>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<OfficeLocationFilter>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const { data, total, isLoading } = usePaginationOfficeLocations(pagination);
  const { onDeactivateOfficeLocation } = useDeactivateOfficeLocation();
  const { onActivateOfficeLocation } = useActivateOfficeLocation();
  const { onApproveOfficeLocation } = useApproveOfficeLocation();
  const { onUnApproveOfficeLocation } = useUnApproveOfficeLocation();
  const { confirm } = useConfirm();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev: PaginationDto<OfficeLocationFilter>) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Tên địa điểm",
      type: "input",
      placeholder: "Nhập tên địa điểm",
      col: 6,
    },
    {
      key: "address",
      label: "Địa chỉ",
      type: "input",
      placeholder: "Nhập địa chỉ",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: Object.values(OFFICE_LOCATION_STATUS),
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
    name: 200,
    address: 250,
    status: 120,
    isDeleted: 120,
    actions: 220,
  });

  const columns = [
    {
      title: "Tên địa điểm",
      dataIndex: "name",
      key: "name",
      width: columnWidths.name,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: columnWidths.address,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: columnWidths.status,
      render: (status: string) => {
        const config = OFFICE_LOCATION_STATUS[status as keyof typeof OFFICE_LOCATION_STATUS] || {
          label: status,
          color: "default",
        };
        return <Tag color={config.color}>{config.label}</Tag>;
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
          <Tag color={colorMap[isDeleted ? "true" : "false"]}>
            {textMap[isDeleted ? "true" : "false"]}
          </Tag>
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
      onClick: (record: OfficeLocationDto) => {
        router.push(
          ROUTES.MAIN.PAYROLL_MANAGER.children.OFFICE_LOCATIONS.children.DETAIL_OFFICE_LOCATION.path.replace(
            ":id",
            record.id!,
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
      hidden: (record: OfficeLocationDto) =>
        record.isDeleted || record.status !== OFFICE_LOCATION_STATUS.PENDING.value,
      onClick: (record: OfficeLocationDto) => {
        router.push(
          ROUTES.MAIN.PAYROLL_MANAGER.children.OFFICE_LOCATIONS.children.EDIT_OFFICE_LOCATION.path.replace(
            ":id",
            record.id!,
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
      hidden: (record: OfficeLocationDto) =>
        record.isDeleted || record.status !== OFFICE_LOCATION_STATUS.PENDING.value,
      onClick: async (record: OfficeLocationDto) => {
        confirm({
          title: "Xác nhận ngừng hoạt động",
          content: `Bạn có chắc chắn muốn ngừng hoạt động địa điểm ${record.name}?`,
          onOk: async () => {
            await onDeactivateOfficeLocation(record.id!);
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
      hidden: (record: OfficeLocationDto) => !record.isDeleted,
      onClick: async (record: OfficeLocationDto) => {
        confirm({
          title: "Xác nhận kích hoạt lại",
          content: `Bạn có chắc chắn muốn kích hoạt lại địa điểm ${record.name}?`,
          onOk: async () => {
            await onActivateOfficeLocation(record.id!);
          },
        });
      },
    },
    {
      key: "approve",
      label: "",
      icon: <CheckOutlined />,
      showKey: "isCanApprove",
      type: "default",
      tooltip: "Duyệt",
      hidden: (record: OfficeLocationDto) =>
        record.isDeleted || record.status !== OFFICE_LOCATION_STATUS.PENDING.value,
      onClick: async (record: OfficeLocationDto) => {
        confirm({
          title: "Xác nhận duyệt",
          content: `Bạn có chắc chắn muốn duyệt địa điểm ${record.name}?`,
          onOk: async () => {
            await onApproveOfficeLocation(record.id!);
          },
        });
      },
    },
    {
      key: "unApprove",
      label: "",
      icon: <CloseOutlined />,
      showKey: "isCanUnApprove",
      type: "default",
      tooltip: "Hủy duyệt",
      hidden: (record: OfficeLocationDto) =>
        record.isDeleted || record.status !== OFFICE_LOCATION_STATUS.APPROVED.value,
      onClick: (record: OfficeLocationDto) => {
        confirm({
          title: "Xác nhận hủy duyệt",
          content: `Bạn có chắc chắn muốn hủy duyệt địa điểm ${record.name}?`,
          onOk: async () => {
            await onUnApproveOfficeLocation(record.id!);
          },
        });
      },
    },
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev: PaginationDto<OfficeLocationFilter>) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleAddNew = () => {
    router.push(
      ROUTES.MAIN.PAYROLL_MANAGER.children.OFFICE_LOCATIONS.children
        .ADD_OFFICE_LOCATION.path,
    );
  };

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={setFilter}
        onSearch={handleSearch}
        onClear={() => handleSearch(true)}
      />
      <Table
        data={data}
        columns={columns}
        actions={actions}
        loading={isLoading}
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total,
          showSizeChanger: true,
        }}
        onPageChange={handlePageChange}
        customToolbar={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Thêm mới
          </Button>
        }
      />
    </BaseView>
  );
}
