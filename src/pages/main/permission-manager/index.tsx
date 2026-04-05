import BaseView from "@/components/base-view/BaseView";
import TableCustom from "@/components/table/Table";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import { useGetAllPermission } from "@/hooks/permission";
import { useSelectBoxRoles, useRoleDetail, useUpdateRole } from "@/hooks/role";
import { useToast } from "@/hooks/layout/useToast";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { SaveOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Row,
  Select,
  Space,
  Tabs,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

const { Title, Text } = Typography;

interface PermissionFilter {
  roleId?: string;
}

const initFilter: PermissionFilter = {};

type UserItem = {
  id: string;
  username: string;
  roles: string[];
  roleIds?: string[];
};

const isSamePermissions = (
  a: Record<string, string[]>,
  b: Record<string, string[]>,
) => JSON.stringify(a) === JSON.stringify(b);

export default function PermissionManager() {
  const [filter, setFilter] = useState<PermissionFilter>(initFilter);
  // Permissions format: {"EMPLOYEE":["READ","CREATE"], "PAYROLL":["READ"]}
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, string[]>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: roles, isLoading: isLoadingRoles } = useSelectBoxRoles();
  const { data: allPermissions, isLoading: isLoadingPermissionModules } =
    useGetAllPermission();
  const {
    data: roleDetail,
    isLoading: isLoadingRoleDetail,
    refetch: refetchRoleDetail,
    error: roleDetailError,
  } = useRoleDetail(filter.roleId || "");
  const { onUpdateRole, isLoading: isSaving } = useUpdateRole(
    filter.roleId || "",
  );
  const showToast = useToast();

  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [isRolesInitialized, setIsRolesInitialized] = useState(false);
  const [isUserRoleDirty, setIsUserRoleDirty] = useState(false);

  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: [API_ENDPOINTS.USER.PAGINATION, "permission-manager"],
    queryFn: () =>
      rootApiService.get<{ content: UserItem[] }>(
        API_ENDPOINTS.USER.PAGINATION,
        {
          page: 0,
          size: 200,
        },
      ),
    select: (res) => res?.content || [],
  });

  const {
    data: selectedUserDetail,
    isLoading: isLoadingUserDetail,
    refetch: refetchUserDetail,
  } = useQuery({
    queryKey: [API_ENDPOINTS.USER.FIND_BY_ID(selectedUserId || "")],
    queryFn: () =>
      rootApiService.get<UserItem>(
        API_ENDPOINTS.USER.FIND_BY_ID(selectedUserId || ""),
      ),
    enabled: !!selectedUserId,
  });

  const { mutateAsync: assignUserRoles, isPending: isAssigningRoles } =
    useMutation({
      mutationFn: ({
        userId,
        roleIds,
      }: {
        userId: string;
        roleIds: string[];
      }) =>
        rootApiService.put(API_ENDPOINTS.USER.ASSIGN_ROLES(userId), {
          roleIds,
        }),
    });

  const moduleConfigMap = useMemo(() => {
    const entries = (allPermissions || []).map((item) => [item.code, item]);
    return Object.fromEntries(entries) as Record<
      string,
      (typeof allPermissions)[number]
    >;
  }, [allPermissions]);

  // Update selected permissions when role detail loads
  useEffect(() => {
    if (!filter.roleId) return;
    const nextPermissions = roleDetail?.permissions || {};
    setSelectedPermissions((prev) =>
      isSamePermissions(prev, nextPermissions) ? prev : nextPermissions,
    );
    setHasChanges(false);
  }, [filter.roleId, roleDetail?.permissionsJson]);

  // Reset selectedRoleIds when selectedUserId changes
  useEffect(() => {
    setSelectedRoleIds([]);
    setIsRolesInitialized(false);
    setIsUserRoleDirty(false);
  }, [selectedUserId]);

  // Load initial roles only once after user detail is loaded
  useEffect(() => {
    if (!selectedUserDetail || isRolesInitialized || isUserRoleDirty) {
      return;
    }

    // Ưu tiên sử dụng roleIds từ API nếu có
    if (
      selectedUserDetail.roleIds &&
      Array.isArray(selectedUserDetail.roleIds) &&
      selectedUserDetail.roleIds.length > 0
    ) {
      setSelectedRoleIds(selectedUserDetail.roleIds);
      setIsRolesInitialized(true);
      return;
    }

    // Fallback: map từ roles name array nếu roleIds không có
    if (
      selectedUserDetail.roles &&
      Array.isArray(selectedUserDetail.roles) &&
      selectedUserDetail.roles.length > 0 &&
      roles &&
      roles.length > 0
    ) {
      const mappedRoleIds = (selectedUserDetail.roles || [])
        .map((roleName) => {
          const foundRole = (roles || []).find(
            (role) =>
              role.name &&
              role.name.trim().toLowerCase() ===
                (roleName || "").trim().toLowerCase(),
          );
          return foundRole?.id;
        })
        .filter(Boolean) as string[];

      setSelectedRoleIds(mappedRoleIds);
      setIsRolesInitialized(true);
      return;
    }

    // Không có roles thì vẫn mark as initialized để không load lại
    setIsRolesInitialized(true);
  }, [selectedUserDetail, isRolesInitialized, roles]);

  const handleRoleSelectionChange = (newValue: string[]) => {
    setSelectedRoleIds(newValue || []);
    setIsUserRoleDirty(true);
  };

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

  const toggleAction = (
    moduleCode: string,
    action: string,
    checked: boolean,
  ) => {
    setSelectedPermissions((prev) => {
      const current = new Set(prev[moduleCode] || []);
      if (checked) current.add(action);
      else current.delete(action);
      return { ...prev, [moduleCode]: Array.from(current) };
    });
    setHasChanges(true);
  };

  const handleSelectAllModule = (code: string, checked: boolean) => {
    const moduleConfig = moduleConfigMap[code];

    setSelectedPermissions((prev) => {
      const actions: string[] = [];
      if (checked) {
        if (moduleConfig?.isCanRead) actions.push("READ");
        if (moduleConfig?.isCanCreate) actions.push("CREATE");
        if (moduleConfig?.isCanUpdate) actions.push("UPDATE");
        if (moduleConfig?.isCanDelete) actions.push("DELETE");
        if (moduleConfig?.isCanActivate) actions.push("ACTIVATE");
        if (moduleConfig?.isCanDeactivate) actions.push("DEACTIVATE");
        if (moduleConfig?.isCanImport) actions.push("IMPORT");
        if (moduleConfig?.isCanExport) actions.push("EXPORT");
      }
      return {
        ...prev,
        [code]: actions,
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

    if (!roleDetail?.name) {
      showToast({
        title: "Lỗi!",
        message: "Không tìm thấy thông tin vai trò để cập nhật",
        type: "error",
      });
      return;
    }

    try {
      await onUpdateRole({
        name: roleDetail.name,
        description: roleDetail.description,
        permissions: selectedPermissions,
      });
      setHasChanges(false);
      refetchRoleDetail();
    } catch {
      // Toast lỗi được xử lý ở hook useUpdateRole để tránh hiển thị trùng.
    }
  };

  const columns = [
    {
      title: "Module",
      dataIndex: "code",
      key: "name",
      width: 200,
      fixed: "left" as const,
      render: (_: any, record: { code: string }) => (
        <Space direction="vertical" size={0}>
          <Text strong>
            {moduleConfigMap[record.code]?.name || record.code}
          </Text>
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
      render: (_: any, record: { code: string }) => {
        const moduleConfig = moduleConfigMap[record.code];
        const selected = new Set(selectedPermissions[record.code] || []);
        const allActions = [
          moduleConfig?.isCanRead ? "READ" : null,
          moduleConfig?.isCanCreate ? "CREATE" : null,
          moduleConfig?.isCanUpdate ? "UPDATE" : null,
          moduleConfig?.isCanDelete ? "DELETE" : null,
          moduleConfig?.isCanActivate ? "ACTIVATE" : null,
          moduleConfig?.isCanDeactivate ? "DEACTIVATE" : null,
          moduleConfig?.isCanImport ? "IMPORT" : null,
          moduleConfig?.isCanExport ? "EXPORT" : null,
        ].filter(Boolean) as string[];

        const allSelected =
          allActions.length > 0 && allActions.every((a) => selected.has(a));

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
      dataIndex: "READ",
      key: "isCanRead",
      width: 80,
      align: "center" as const,
      render: (_: any, record: { code: string }) => (
        <Checkbox
          checked={(selectedPermissions[record.code] || []).includes("READ")}
          onChange={(e) => toggleAction(record.code, "READ", e.target.checked)}
          disabled={!filter.roleId || !moduleConfigMap[record.code]?.isCanRead}
        />
      ),
    },
    {
      title: "Thêm",
      dataIndex: "CREATE",
      key: "isCanCreate",
      width: 80,
      align: "center" as const,
      render: (_: any, record: { code: string }) => (
        <Checkbox
          checked={(selectedPermissions[record.code] || []).includes("CREATE")}
          onChange={(e) =>
            toggleAction(record.code, "CREATE", e.target.checked)
          }
          disabled={
            !filter.roleId || !moduleConfigMap[record.code]?.isCanCreate
          }
        />
      ),
    },
    {
      title: "Sửa",
      dataIndex: "UPDATE",
      key: "isCanUpdate",
      width: 80,
      align: "center" as const,
      render: (_: any, record: { code: string }) => (
        <Checkbox
          checked={(selectedPermissions[record.code] || []).includes("UPDATE")}
          onChange={(e) =>
            toggleAction(record.code, "UPDATE", e.target.checked)
          }
          disabled={
            !filter.roleId || !moduleConfigMap[record.code]?.isCanUpdate
          }
        />
      ),
    },
    {
      title: "Xóa",
      dataIndex: "DELETE",
      key: "isCanDelete",
      width: 80,
      align: "center" as const,
      render: (_: any, record: { code: string }) => (
        <Checkbox
          checked={(selectedPermissions[record.code] || []).includes("DELETE")}
          onChange={(e) =>
            toggleAction(record.code, "DELETE", e.target.checked)
          }
          disabled={
            !filter.roleId || !moduleConfigMap[record.code]?.isCanDelete
          }
        />
      ),
    },
    {
      title: "Kích hoạt",
      dataIndex: "ACTIVATE",
      key: "isCanActivate",
      width: 100,
      align: "center" as const,
      render: (_: any, record: { code: string }) => (
        <Checkbox
          checked={(selectedPermissions[record.code] || []).includes(
            "ACTIVATE",
          )}
          onChange={(e) =>
            toggleAction(record.code, "ACTIVATE", e.target.checked)
          }
          disabled={
            !filter.roleId || !moduleConfigMap[record.code]?.isCanActivate
          }
        />
      ),
    },
    {
      title: "Vô hiệu hóa",
      dataIndex: "DEACTIVATE",
      key: "isCanDeactivate",
      width: 120,
      align: "center" as const,
      render: (_: any, record: { code: string }) => (
        <Checkbox
          checked={(selectedPermissions[record.code] || []).includes(
            "DEACTIVATE",
          )}
          onChange={(e) =>
            toggleAction(record.code, "DEACTIVATE", e.target.checked)
          }
          disabled={
            !filter.roleId || !moduleConfigMap[record.code]?.isCanDeactivate
          }
        />
      ),
    },
    {
      title: "Nhập",
      dataIndex: "IMPORT",
      key: "isCanImport",
      width: 80,
      align: "center" as const,
      render: (_: any, record: { code: string }) => (
        <Checkbox
          checked={(selectedPermissions[record.code] || []).includes("IMPORT")}
          onChange={(e) =>
            toggleAction(record.code, "IMPORT", e.target.checked)
          }
          disabled={
            !filter.roleId || !moduleConfigMap[record.code]?.isCanImport
          }
        />
      ),
    },
    {
      title: "Xuất",
      dataIndex: "EXPORT",
      key: "isCanExport",
      width: 80,
      align: "center" as const,
      render: (_: any, record: { code: string }) => (
        <Checkbox
          checked={(selectedPermissions[record.code] || []).includes("EXPORT")}
          onChange={(e) =>
            toggleAction(record.code, "EXPORT", e.target.checked)
          }
          disabled={
            !filter.roleId || !moduleConfigMap[record.code]?.isCanExport
          }
        />
      ),
    },
  ];

  const isLoading =
    isLoadingRoleDetail ||
    isLoadingRoles ||
    isLoadingPermissionModules ||
    isSaving;
  const isSavingUserRoles = isAssigningRoles || isLoadingUserDetail;

  const moduleRows = (allPermissions || []).map((item) => ({
    code: item.code,
  }));

  // Tab 1: Module permissions by role
  const modulePermissionsTab = {
    key: "module-permissions",
    label: "Phân quyền theo vai trò",
    children: (
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
            variant="borderless"
          >
            {roleDetailError && (
              <Alert
                type="error"
                showIcon
                message="Không thể tải dữ liệu phân quyền"
                description={
                  (roleDetailError as any)?.message || "Đã có lỗi xảy ra"
                }
                style={{ marginBottom: 12 }}
              />
            )}
            <TableCustom
              columns={columns}
              data={moduleRows}
              rowKey="code"
              loading={isLoading}
              scroll={{ x: 1200 }}
              bordered
              size="middle"
            />
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
    ),
  };

  // Tab 2: User role assignment
  const userRoleTab = {
    key: "user-roles",
    label: "Gán vai trò cho người dùng",
    children: (
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text strong>Người dùng</Typography.Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                showSearch
                placeholder="Chọn người dùng"
                loading={isLoadingUsers}
                value={selectedUserId}
                onChange={setSelectedUserId}
                options={(users || []).map((u) => ({
                  value: u.id,
                  label: `${u.username} (${(u.roles || []).join(", ") || "chưa có role"})`,
                }))}
                optionFilterProp="label"
              />
            </Col>
            <Col span={12}>
              <Typography.Text strong>Vai trò</Typography.Text>
              <Select
                mode="multiple"
                style={{ width: "100%", marginTop: 8 }}
                placeholder="Chọn một hoặc nhiều vai trò"
                value={selectedRoleIds || []}
                onChange={handleRoleSelectionChange}
                options={(roles || []).map((r) => ({
                  value: r.id,
                  label: r.name,
                }))}
                loading={isLoadingRoles}
                disabled={!selectedUserId || !roles || roles.length === 0}
              />
            </Col>
          </Row>

          {!roles || roles.length === 0 ? (
            <Alert
              message="Không có vai trò nào"
              description="Vui lòng tạo vai trò trước khi gán cho người dùng"
              type="warning"
              showIcon
            />
          ) : null}

          <Row justify="end">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              disabled={!selectedUserId || selectedRoleIds.length === 0}
              loading={isSavingUserRoles}
              onClick={async () => {
                if (!selectedUserId) return;
                try {
                  await assignUserRoles({
                    userId: selectedUserId,
                    roleIds: selectedRoleIds,
                  });

                  showToast({
                    title: "Thành công!",
                    message: "Đã cập nhật vai trò cho người dùng",
                    type: "success",
                  });

                  // Reset initialization flag to reload roles from API
                  setIsRolesInitialized(false);
                  setIsUserRoleDirty(false);

                  // Ensure refetch properly updates UI
                  await Promise.all([refetchUserDetail(), refetchUsers()]);
                } catch (error: any) {
                  showToast({
                    title: "Thất bại!",
                    message:
                      error?.message || "Không thể cập nhật vai trò người dùng",
                    type: "error",
                  });
                }
              }}
            >
              Lưu gán vai trò
            </Button>
          </Row>
        </Space>
      </Card>
    ),
  };

  return (
    <BaseView>
      <Tabs
        defaultActiveKey="module-permissions"
        items={[modulePermissionsTab, userRoleTab]}
      />
    </BaseView>
  );
}
