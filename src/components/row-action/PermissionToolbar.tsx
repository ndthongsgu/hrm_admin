import { Button, Space } from "antd";
import { PlusOutlined, ImportOutlined, ExportOutlined, ReloadOutlined } from "@ant-design/icons";
import Can from "@/components/auth/Can";
import type { ModuleCodeType } from "@/dto/auth.dto";

interface PermissionToolbarProps {
  moduleCode: ModuleCodeType;
  onAdd?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  addLabel?: string;
  importLabel?: string;
  exportLabel?: string;
  refreshLabel?: string;
  extra?: React.ReactNode;
}

/**
 * Component toolbar với các action buttons có kiểm tra quyền
 * Thường được đặt phía trên Table
 * 
 * @example
 * ```tsx
 * <PermissionToolbar
 *   moduleCode={ModuleCode.CUSTOMER}
 *   onAdd={() => navigate('/customer/add')}
 *   onImport={handleImport}
 *   onExport={handleExport}
 *   onRefresh={refetch}
 * />
 * ```
 */
export default function PermissionToolbar({
  moduleCode,
  onAdd,
  onImport,
  onExport,
  onRefresh,
  addLabel = "Tạo mới",
  importLabel = "Import",
  exportLabel = "Export",
  refreshLabel = "Làm mới",
  extra,
}: PermissionToolbarProps) {
  return (
    <div style={{ 
      marginBottom: 16, 
      display: "flex", 
      justifyContent: "space-between",
      alignItems: "center" 
    }}>
      <Space>
        {/* Add button - requires isCanCreate permission */}
        {onAdd && (
          <Can moduleCode={moduleCode} action="isCanCreate">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={onAdd}
            >
              {addLabel}
            </Button>
          </Can>
        )}

        {/* Import button - requires isCanImport permission */}
        {onImport && (
          <Can moduleCode={moduleCode} action="isCanImport">
            <Button 
              icon={<ImportOutlined />}
              onClick={onImport}
            >
              {importLabel}
            </Button>
          </Can>
        )}

        {/* Export button - requires isCanExport permission */}
        {onExport && (
          <Can moduleCode={moduleCode} action="isCanExport">
            <Button 
              icon={<ExportOutlined />}
              onClick={onExport}
            >
              {exportLabel}
            </Button>
          </Can>
        )}

        {/* Refresh button - always visible */}
        {onRefresh && (
          <Button 
            icon={<ReloadOutlined />}
            onClick={onRefresh}
          >
            {refreshLabel}
          </Button>
        )}
      </Space>

      {/* Extra actions/filters */}
      {extra && <Space>{extra}</Space>}
    </div>
  );
}
