import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import RowActions from "@/components/row-action";
import { CommonActions } from "@/components/row-action/CommonAction";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { DependentDto, DependentFilter } from "@/dto/dependent.dto";
import { usePaginationDependent } from "@/hooks/dependent";
import { useDetailEmployee } from "@/hooks/employee";
import { useRouter } from "@/routes/hooks";
import { EditOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const initFilter: DependentFilter = {
  fullName: "",
  relationship: "",
};

export default function DependentManagerScreen() {
  const { id: employeeId } = useParams<{ id: string }>();
  const router = useRouter();

  const [filter, setFilter] = useState<DependentFilter>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<DependentFilter>>({
    skip: 0,
    take: 10,
    where: {
      ...initFilter,
      employeeId,
    },
  });

  const employeeDetail = useDetailEmployee(employeeId || "");

  const { data, total, isLoading } = usePaginationDependent(
    pagination,
    !!employeeId
  );

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      where: {
        employeeId,
        ...(isReset ? initFilter : { ...prev.where, ...filter }),
      },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "fullName",
      label: "Tên thân nhân",
      type: "input",
      placeholder: "Nhập tên thân nhân",
      col: 8,
    },
    {
      key: "relationship",
      label: "Mối quan hệ",
      type: "input",
      placeholder: "Nhập mối quan hệ",
      col: 8,
    },
  ];

  const [columnWidths] = useState<Record<string, number>>({
    fullName: 220,
    relationship: 180,
    birthDate: 180,
    isQualified: 180,
    actions: 110,
  });

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: columnWidths.fullName,
    },
    {
      title: "Mối quan hệ",
      dataIndex: "relationship",
      key: "relationship",
      width: columnWidths.relationship,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthDate",
      key: "birthDate",
      width: columnWidths.birthDate,
      render: (value?: string) =>
        value ? dayjs(value).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Giảm trừ",
      dataIndex: "isQualified",
      key: "isQualified",
      width: columnWidths.isQualified,
      render: (isQualified?: boolean) => (
        <Tag color={isQualified ? "green" : "default"}>
          {isQualified ? "Được tính" : "Không tính"}
        </Tag>
      ),
    },
  ];

  const actions: TableAction[] = [
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      showKey: "isCanEdit",
      type: "default",
      tooltip: "Chỉnh sửa",
      onClick: (record) => {
        if (!employeeId) return;
        router.push(
          ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children.EDIT_DEPENDENT.path
            .replace(":id", employeeId)
            .replace(":dependentId", record.id)
        );
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

  const employeeTitle = useMemo(() => {
    if (!employeeId) return "Quản lý thân nhân";
    if (employeeDetail.data?.fullName) {
      return `Quản lý thân nhân - ${employeeDetail.data.fullName}`;
    }
    return "Quản lý thân nhân";
  }, [employeeDetail.data?.fullName, employeeId]);

  return (
    <BaseView>
      <h2 style={{ marginBottom: "16px" }}>{employeeTitle}</h2>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={(newFilters: Record<string, unknown>) =>
          setFilter(newFilters as DependentFilter)
        }
        onSearch={handleSearch}
        onClear={() => {
          setFilter(initFilter);
          handleSearch(true);
        }}
      />

      <TableCustom<DependentDto>
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
          <RowActions
            actions={[
              CommonActions.create(() => {
                if (!employeeId) return;
                router.push(
                  ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children.ADD_DEPENDENT.path.replace(
                    ":id",
                    employeeId
                  )
                );
              }),
            ]}
          />
        }
      />
    </BaseView>
  );
}
