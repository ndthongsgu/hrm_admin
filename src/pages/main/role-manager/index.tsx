import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import RowActions from "@/components/row-action";
import { CommonActions } from "@/components/row-action/CommonAction";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { RoleDto } from "@/dto/role.dto";
import { useActivateRole, useDeActivateRole, usePaginationRole } from "@/hooks/role";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

export default function RoleManager() {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationDto<object>>({
    skip: 0,
    take: 10,
    where: {},
  });

  const { data, total, isLoading } = usePaginationRole(pagination);
  const { onDeActivateRole, isLoading: isLoadingDeactivating } = useDeActivateRole();
  const { onActivateRole, isLoading: isLoadingActivating } = useActivateRole();

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.ROLE_MANAGER.Children.ADD_ROLE
        .path
    );
  };

  const [columnWidths] = useState<Record<string, number>>({
    code: 120,
    name: 200,
    email: 200,
    phone: 150,
    createdDate: 180,
  });

  const columns = [
    {
      title: "Mã vai trò",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Tên vai trò",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 120,
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
          ROUTES.MAIN.ROLE_MANAGER.Children.DETAIL_ROLE.path.replace(
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
          ROUTES.MAIN.ROLE_MANAGER.Children.EDIT_ROLE.path.replace(
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
        onDeActivateRole(record.id);
      }
    },

    {
      key: "activate",
      tooltip: "Kích hoạt",
      showKey: "isCanActivate",
      label: "",
      type: "default",
      render: () => <Button icon={<PlayCircleOutlined />} />,
      onClick: (record) => {
        onActivateRole(record.id);
      }
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
      <TableCustom<RoleDto>
        loading={isLoading || isLoadingActivating || isLoadingDeactivating}
        columns={columns}
        columnWidths={columnWidths}
        data={data}
        actions={actions}
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
    </BaseView>
  );
}
