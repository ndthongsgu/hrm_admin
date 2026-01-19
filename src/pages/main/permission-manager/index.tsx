import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import type { ModulePermission } from "@/dto/auth.dto";
import {
  useAssignPermissionToRole,
  useGetPermissionByRole,
} from "@/hooks/permission";
import { useSelectBoxRoles } from "@/hooks/role";
import { useToast } from "@/hooks/layout/useToast";
import { SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Row,
  Space,
  Table,
  Typography,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { module_show_map } from "@/common/constants/module";

const { Title, Text } = Typography;

interface PermissionFilter {
  roleId?: string;
}

const initFilter: PermissionFilter = {};

export default function PermissionManager() {
  const [filter, setFilter] = useState<PermissionFilter>(initFilter);
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, ModulePermission>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: roles, isLoading: isLoadingRoles } = useSelectBoxRoles();
  const {
    data: rolePermissions,
    isLoading: isLoadingRolePermissions,
    refetch: refetchRolePermissions,
  } = useGetPermissionByRole(filter.roleId || "");
  const { assignPermissionToRole } = useAssignPermissionToRole(
    filter.roleId || ""
  );
  const showToast = useToast();

  // Load permissions when role changes
  useEffect(() => {
    if (filter.roleId) {
      refetchRolePermissions();
    }
  }, [filter.roleId, refetchRolePermissions]);

  // Update selected permissions when role permissions load
  useEffect(() => {
    if (rolePermissions && rolePermissions.length > 0) {
      const permissionMap: Record<string, ModulePermission> = {};
      rolePermissions.forEach((perm) => {
        permissionMap[perm.code] = perm;
      });
      setSelectedPermissions(permissionMap);
      setHasChanges(false);
    } else if (filter.roleId) {
      // Reset to empty permissions when role has no permissions
      setSelectedPermissions({});
      setHasChanges(false);
    }
  }, [filter.roleId]);

  const handleSearch = (isReset?: boolean) => {
    if (isReset) {
      setFilter(initFilter);
      setSelectedPermissions({});
      setHasChanges(false);
    }
  };

  const filterFields: FilterField[] = [
    {
      key: "roleId",
      label: "Vai trò",
      type: "select",
      placeholder: "Chọn vai trò",
      options: roles?.map((role) => ({
        label: role.name,
        value: role.id,
      })),
      col: 8,
      disabled: isLoadingRoles,
    },
  ];

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as PermissionFilter);
    setHasChanges(false);
  };

  const handlePermissionChange = (
    code: string,
    permission: keyof Omit<
      ModulePermission,
      "code" | "name" | "description" | "urlPageView"
    >,
    value: boolean
  ) => {
    setSelectedPermissions((prev) => {
      const currentModule = prev[code] || {
        code,
        name: rolePermissions?.find((p) => p.code === code)?.name || code,
        description:
          rolePermissions?.find((p) => p.code === code)?.description || "",
        urlPageView:
          rolePermissions?.find((p) => p.code === code)?.urlPageView || "",
        isCanRead: false,
        isCanCreate: false,
        isCanUpdate: false,
        isCanDelete: false,
        isCanActivate: false,
        isCanDeactivate: false,
        isCanImport: false,
        isCanExport: false,
      };

      return {
        ...prev,
        [code]: {
          ...currentModule,
          [permission]: value,
        },
      };
    });
    setHasChanges(true);
  };

  const handleSelectAllModule = (code: string, checked: boolean) => {
    const moduleConfig = module_show_map[code]; // lấy config module từ map

    setSelectedPermissions((prev) => {
      const currentModule = prev[code] || {
        code,
        name: rolePermissions?.find((p) => p.code === code)?.name || code,
        description:
          rolePermissions?.find((p) => p.code === code)?.description || "",
        urlPageView:
          rolePermissions?.find((p) => p.code === code)?.urlPageView || "",
        isCanRead: false,
        isCanCreate: false,
        isCanUpdate: false,
        isCanDelete: false,
        isCanActivate: false,
        isCanDeactivate: false,
        isCanImport: false,
        isCanExport: false,
      };

      // chỉ gán những quyền được phép (module_show_map = true)
      return {
        ...prev,
        [code]: {
          ...currentModule,
          isCanRead: moduleConfig?.isCanRead
            ? checked
            : currentModule.isCanRead,
          isCanCreate: moduleConfig?.isCanCreate
            ? checked
            : currentModule.isCanCreate,
          isCanUpdate: moduleConfig?.isCanUpdate
            ? checked
            : currentModule.isCanUpdate,
          isCanDelete: moduleConfig?.isCanDelete
            ? checked
            : currentModule.isCanDelete,
          isCanActivate: moduleConfig?.isCanActivate
            ? checked
            : currentModule.isCanActivate,
          isCanDeactivate: moduleConfig?.isCanDeactivate
            ? checked
            : currentModule.isCanDeactivate,
          isCanImport: moduleConfig?.isCanImport
            ? checked
            : currentModule.isCanImport,
          isCanExport: moduleConfig?.isCanExport
            ? checked
            : currentModule.isCanExport,
        },
      };
    });

    setHasChanges(true);
  };

  const handleSavePermissions = async () => {
  if (!filter.roleId) {
    showToast({
      title: "Lỗi!",
      message: "Vui lòng chọn vai trò",
      type: "error",
    });
    return;
  }

  try {
    // Build payload theo BE yêu cầu
    const payload = Object.values(selectedPermissions).map((perm) => ({
      roleId: filter.roleId,
      module: perm.code,
      isCanRead: !!perm.isCanRead,
      isCanCreate: !!perm.isCanCreate,
      isCanUpdate: !!perm.isCanUpdate,
      isCanDelete: !!perm.isCanDelete,
      isCanActivate: !!perm.isCanActivate,
      isCanDeactivate: !!perm.isCanDeactivate,
      isCanImport: !!perm.isCanImport,
      isCanExport: !!perm.isCanExport,
    }));

    await assignPermissionToRole(payload);

    showToast({
      title: "Thành công!",
      message: "Phân quyền thành công!",
      type: "success",
    });
    setHasChanges(false);
    refetchRolePermissions();
  } catch (error: any) {
    showToast({
      title: "Thất bại!",
      message: error?.message || "Phân quyền thất bại!",
      type: "error",
    });
  }
};


  const columns = [
    {
      title: "Module",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left" as const,
      render: (text: string, record: ModulePermission) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.code}
          </Text>
        </Space>
      ),
    },
    {
      title: "Chọn tất cả",
      key: "selectAll",
      width: 100,
      align: "center" as const,
      render: (_: any, record: ModulePermission) => {
        const currentPerm = selectedPermissions[record.code];
        const allSelected =
          currentPerm &&
          currentPerm.isCanRead &&
          currentPerm.isCanCreate &&
          currentPerm.isCanUpdate &&
          currentPerm.isCanDelete &&
          currentPerm.isCanActivate &&
          currentPerm.isCanDeactivate &&
          currentPerm.isCanImport &&
          currentPerm.isCanExport;

        return (
          <Checkbox
            checked={allSelected}
            onChange={(e) =>
              handleSelectAllModule(record.code, e.target.checked)
            }
            disabled={!filter.roleId}
          />
        );
      },
    },
    {
      title: "Xem",
      dataIndex: "isCanRead",
      key: "isCanRead",
      width: 80,
      align: "center" as const,
      render: (_: any, record: ModulePermission) => (
        <Checkbox
          checked={selectedPermissions[record.code]?.isCanRead || false}
          onChange={(e) =>
            handlePermissionChange(record.code, "isCanRead", e.target.checked)
          }
          disabled={!filter.roleId || !module_show_map[record.code]?.isCanRead}
        />
      ),
    },
    {
      title: "Thêm",
      dataIndex: "isCanCreate",
      key: "isCanCreate",
      width: 80,
      align: "center" as const,
      render: (_: any, record: ModulePermission) => (
        <Checkbox
          checked={selectedPermissions[record.code]?.isCanCreate || false}
          onChange={(e) =>
            handlePermissionChange(record.code, "isCanCreate", e.target.checked)
          }
          disabled={
            !filter.roleId || !module_show_map[record.code]?.isCanCreate
          }
        />
      ),
    },
    {
      title: "Sửa",
      dataIndex: "isCanUpdate",
      key: "isCanUpdate",
      width: 80,
      align: "center" as const,
      render: (_: any, record: ModulePermission) => (
        <Checkbox
          checked={selectedPermissions[record.code]?.isCanUpdate || false}
          onChange={(e) =>
            handlePermissionChange(record.code, "isCanUpdate", e.target.checked)
          }
          disabled={
            !filter.roleId || !module_show_map[record.code]?.isCanUpdate
          }
        />
      ),
    },
    {
      title: "Xóa",
      dataIndex: "isCanDelete",
      key: "isCanDelete",
      width: 80,
      align: "center" as const,
      render: (_: any, record: ModulePermission) => (
        <Checkbox
          checked={selectedPermissions[record.code]?.isCanDelete || false}
          onChange={(e) =>
            handlePermissionChange(record.code, "isCanDelete", e.target.checked)
          }
          disabled={
            !filter.roleId || !module_show_map[record.code]?.isCanDelete
          }
        />
      ),
    },
    {
      title: "Kích hoạt",
      dataIndex: "isCanActivate",
      key: "isCanActivate",
      width: 100,
      align: "center" as const,
      render: (_: any, record: ModulePermission) => (
        <Checkbox
          checked={selectedPermissions[record.code]?.isCanActivate || false}
          onChange={(e) =>
            handlePermissionChange(
              record.code,
              "isCanActivate",
              e.target.checked
            )
          }
          disabled={
            !filter.roleId || !module_show_map[record.code]?.isCanActivate
          }
        />
      ),
    },
    {
      title: "Vô hiệu hóa",
      dataIndex: "isCanDeactivate",
      key: "isCanDeactivate",
      width: 120,
      align: "center" as const,
      render: (_: any, record: ModulePermission) => (
        <Checkbox
          checked={selectedPermissions[record.code]?.isCanDeactivate || false}
          onChange={(e) =>
            handlePermissionChange(
              record.code,
              "isCanDeactivate",
              e.target.checked
            )
          }
          disabled={
            !filter.roleId || !module_show_map[record.code]?.isCanDeactivate
          }
        />
      ),
    },
    {
      title: "Nhập",
      dataIndex: "isCanImport",
      key: "isCanImport",
      width: 80,
      align: "center" as const,
      render: (_: any, record: ModulePermission) => (
        <Checkbox
          checked={selectedPermissions[record.code]?.isCanImport || false}
          onChange={(e) =>
            handlePermissionChange(record.code, "isCanImport", e.target.checked)
          }
          disabled={
            !filter.roleId || !module_show_map[record.code]?.isCanImport
          }
        />
      ),
    },
    {
      title: "Xuất",
      dataIndex: "isCanExport",
      key: "isCanExport",
      width: 80,
      align: "center" as const,
      render: (_: any, record: ModulePermission) => (
        <Checkbox
          checked={selectedPermissions[record.code]?.isCanExport || false}
          onChange={(e) =>
            handlePermissionChange(record.code, "isCanExport", e.target.checked)
          }
          disabled={
            !filter.roleId || !module_show_map[record.code]?.isCanExport
          }
        />
      ),
    },
  ];

  const isLoading = isLoadingRolePermissions || isLoadingRoles;

  return (
    <BaseView>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <FilterComponent
          fields={filterFields}
          filters={filter}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          onClear={() => handleSearch(true)}
        />

        {filter.roleId && (
          <Card
            title={
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={4} style={{ margin: 0 }}>
                    Phân quyền cho vai trò:{" "}
                    {roles?.find((r) => r.id === filter.roleId)?.name}
                  </Title>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSavePermissions}
                    disabled={!hasChanges}
                    loading={isLoading}
                  >
                    Lưu phân quyền
                  </Button>
                </Col>
              </Row>
            }
            bordered={false}
          >
            <Spin spinning={isLoading}>
              <Table
                columns={columns}
                dataSource={rolePermissions || []}
                rowKey="code"
                pagination={false}
                scroll={{ x: 1200 }}
                bordered
                size="middle"
              />
            </Spin>
          </Card>
        )}

        {!filter.roleId && (
          <Card>
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
              }}
            >
              <Text type="secondary" style={{ fontSize: 16 }}>
                Vui lòng chọn vai trò để phân quyền
              </Text>
            </div>
          </Card>
        )}
      </Space>
    </BaseView>
  );
}
