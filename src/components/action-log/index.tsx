import { formatDateTime } from "@/common/helpers/format";
import type { PaginationDto } from "@/dto/base.dto";
import {
  ActionType,
  useActionLogPagination,
  type ActionLogFilter,
} from "@/hooks/action";
import { Tag } from "antd";
import { useMemo, useState } from "react";
import TableCustom from "../table/Table";

interface ActionLogViewProps {
  functionId: string;
  functionType: string;
  type?: string;
  createdBy?: string;
}

export default function ActionLogView({
  functionId,
  functionType,
  type,
  createdBy,
}: ActionLogViewProps) {
  const initialPagination = useMemo(
    () => ({
      where: { functionType, functionId, type, createdBy },
      skip: 0,
      take: 10,
    }),
    [functionType, functionId, type, createdBy]
  );

  const [pagination, setPagination] =
    useState<PaginationDto<ActionLogFilter>>(initialPagination);

  const { data, total, isLoading } = useActionLogPagination(pagination);

  const actionColors = useMemo<Record<keyof typeof ActionType, string>>(
    () => ({
      Create: "green",
      Update: "blue",
      Delete: "red",
      Cancel: "orange",
      Approve: "cyan",
      Deactivate: "red",
      Activate: "geekblue",
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        title: "Ngày cập nhật",
        dataIndex: "createdDate",
        key: "createdDate",
        render: (text: string) => formatDateTime(text),
        width: 160,
      },
      {
        title: "Người cập nhật",
        dataIndex: "createdByName",
        key: "createdByName",
        render: (text: string) => text || "System",
        width: 160,
      },
      {
        title: "Hành động",
        dataIndex: "action",
        key: "action",
        width: 140,
        render: (value: keyof typeof ActionType) => {
          const label = ActionType[value] ?? value;
          const color = actionColors[value] || "default";
          return <Tag color={color}>{label}</Tag>;
        },
      },
      {
        title: "Nội dung thay đổi",
        key: "description",
        dataIndex: "description",
        width: 600,
        render: (text: string) => text || "System",
      },
    ],
    [actionColors]
  );

  const paginationConfig = useMemo(
    () => ({
      total,
      current: Math.floor(pagination.skip / pagination.take) + 1,
      pageSize: pagination.take,
      showSizeChanger: true,
    }),
    [total, pagination.skip, pagination.take]
  );

  return (
    <TableCustom<any>
      data={data}
      columns={columns}
      onPageChange={(page: number, pageSize: number) => {
        setPagination((prev) => ({
          ...prev,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }));
      }}
      loading={isLoading}
      pagination={paginationConfig}
    />
  );
}
