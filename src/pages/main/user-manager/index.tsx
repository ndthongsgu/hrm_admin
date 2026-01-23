import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import RowActions from "@/components/row-action";
import { CommonActions } from "@/components/row-action/CommonAction";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { UserDto } from "@/dto/user.dto";
import {
  useActivateUser,
  useDeActivateUser,
  usePaginationUser,
} from "@/hooks/user";
import { useRouter } from "@/routes/hooks";
import {
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Row, Tag } from "antd";
import { useState } from "react";

export default function UserManager() {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationDto<object>>({
    skip: 0,
    take: 10,
    where: {},
  });

  const { data, total, isLoading } = usePaginationUser(pagination);
  const { onDeActivateUser, isLoading: isLoadingDeactivating } =
    useDeActivateUser();
  const { onActivateUser, isLoading: isLoadingActivating } = useActivateUser();

  const handleCreate = () => {
    router.push(ROUTES.MAIN.USER_MANAGER.children.ADD_USER.path);
  };

  const [columnWidths] = useState<Record<string, number>>({
    username: 150,
    email: 200,
    fullName: 200,
    phoneNumber: 150,
    roles: 200,
    isActive: 120,
    createdDate: 180,
  });

  const columns = [
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 150,
    },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      width: 200,
      render: (roles: any[]) => {
        if (!roles || roles.length === 0) return "-";
        return (
          <Row gutter={[4, 4]}>
            {roles.map((role, index) => (
              <Tag key={index} color="blue">
                {role.name}
              </Tag>
            ))}
          </Row>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
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
            <Tag color={colorMap[isActive as keyof typeof colorMap]}>
              {textMap[isActive as keyof typeof textMap]}
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
          ROUTES.MAIN.USER_MANAGER.children.DETAIL_USER.path.replace(
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
          ROUTES.MAIN.USER_MANAGER.children.EDIT_USER.path.replace(
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
        onDeActivateUser(record.id);
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
        onActivateUser(record.id);
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
      <TableCustom<UserDto>
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
