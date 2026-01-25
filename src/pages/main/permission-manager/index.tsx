import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import { useSelectBoxRoles, useRoleDetail, useUpdateRole } from "@/hooks/role";
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
  // Permissions format: {"EMPLOYEE":["READ","CREATE"], "PAYROLL":["READ"]}
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, string[]>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: roles, isLoading: isLoadingRoles } = useSelectBoxRoles();
  const {
    data: roleDetail,
    isLoading: isLoadingRoleDetail,
    refetch: refetchRoleDetail,
  } = useRoleDetail(filter.roleId || "");
  const { onUpdateRole, isLoading: isSaving } = useUpdateRole(
    filter.roleId || ""
  );
  const showToast = useToast();

  // Update selected permissions when role detail loads
  useEffect(() => {
    if (!filter.roleId) return;
    // roleDetail.permissions is already parsed as Record<string, string[]> from service
    setSelectedPermissions(roleDetail?.permissions || {});
    setHasChanges(false);
  }, [filter.roleId, roleDetail?.permissions]);

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

  const toggleAction = (moduleCode: string, action: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const current = new Set(prev[moduleCode] || []);
      if (checked) current.add(action);
      else current.delete(action);
      return { ...prev, [moduleCode]: Array.from(current) };
    });
    setHasChanges(true);
  };

  const handleSelectAllModule = (code: string, checked: boolean) => {
    const moduleConfig = module_show_map[code];

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

    try {
      // Send permissions as object, service layer will transform to permissionsJson string
      await onUpdateRole({
        permissions: selectedPermissions,
      });

      showToast({
        title: "Thành công!",
        message: "Phân quyền thành công!",
        type: "success",
      });
      setHasChanges(false);
      refetchRoleDetail();
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
      dataIndex: "code",
      key: "name",
      width: 200,
      fixed: "left" as const,
      render: (_: any, record: { code: string }) => (
        <Space direction="vertical" size={0}>
          <Text strong>{module_show_map[record.code]?.name || record.code}</Text>
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
        const moduleConfig = module_show_map[record.code];
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
          disabled={!filter.roleId || !module_show_map[record.code]?.isCanRead}
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
            !filter.roleId || !module_show_map[record.code]?.isCanCreate
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
            !filter.roleId || !module_show_map[record.code]?.isCanUpdate
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
            !filter.roleId || !module_show_map[record.code]?.isCanDelete
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
          checked={(selectedPermissions[record.code] || []).includes("ACTIVATE")}
          onChange={(e) =>
            toggleAction(record.code, "ACTIVATE", e.target.checked)
          }
          disabled={
            !filter.roleId || !module_show_map[record.code]?.isCanActivate
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
          checked={(selectedPermissions[record.code] || []).includes("DEACTIVATE")}
          onChange={(e) =>
            toggleAction(record.code, "DEACTIVATE", e.target.checked)
          }
          disabled={
            !filter.roleId || !module_show_map[record.code]?.isCanDeactivate
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
            !filter.roleId || !module_show_map[record.code]?.isCanImport
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
            !filter.roleId || !module_show_map[record.code]?.isCanExport
          }
        />
      ),
    },
  ];

  const isLoading = isLoadingRoleDetail || isLoadingRoles || isSaving;

  const moduleRows = Object.keys(module_show_map).map((code) => ({ code }));

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
                dataSource={moduleRows}
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
