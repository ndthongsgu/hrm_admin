import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { PositionFilter } from "@/dto/position.dto";
import {
  useActivatePosition,
  useDeActivatePosition,
  usePaginationPosition,
} from "@/hooks/position";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

const initFilter: PositionFilter = {
  code: "",
  name: "",
  isActive: undefined,
};

export default function PositionManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<PositionFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<PositionFilter>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, total, isLoading } = usePaginationPosition(pagination);
  const { onDeActivatePosition } = useDeActivatePosition();
  const { onActivatePosition } = useActivatePosition();

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
      label: "Mã chức vụ",
      type: "input",
      placeholder: "Nhập mã chức vụ",
      col: 6,
    },
    {
      key: "name",
      label: "Tên chức vụ",
      type: "input",
      placeholder: "Nhập tên chức vụ",
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
    level: 100,
    baseSalary: 150,
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
      title: "Tên chức vụ",
      dataIndex: "name",
      key: "name",
      width: columnWidths.name,
    },
    {
      title: "Cấp bậc",
      dataIndex: "level",
      key: "level",
      width: columnWidths.level,
      render: (level: number) => level || "N/A",
    },
    {
      title: "Lương cơ bản",
      dataIndex: "baseSalary",
      key: "baseSalary",
      width: columnWidths.baseSalary,
      render: (baseSalary: number) =>
        baseSalary ? baseSalary.toLocaleString("vi-VN") + " VNĐ" : "N/A",
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
          ROUTES.MAIN.POSITION_MANAGER.children.DETAIL_POSITION.path.replace(
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
          ROUTES.MAIN.POSITION_MANAGER.children.EDIT_POSITION.path.replace(
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
        onDeActivatePosition(record.id);
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
        onActivatePosition(record.id);
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
      <h2 style={{ marginBottom: "16px" }}>Danh sách chức vụ</h2>
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
