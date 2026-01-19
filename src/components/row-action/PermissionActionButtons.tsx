import { Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import Can from "@/components/auth/Can";
import type { ModuleCodeType } from "@/dto/auth.dto";

interface PermissionActionButtonsProps {
  moduleCode: ModuleCodeType;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  record?: any;
}

/**
 * Component hiển thị các action buttons có kiểm tra quyền
 * Sử dụng trong cột "Thao tác" của Table
 * 
 * @example
 * ```tsx
 * <Table
 *   columns={[
 *     // ... other columns
 *     {
 *       title: "Thao tác",
 *       render: (_, record) => (
 *         <PermissionActionButtons
 *           moduleCode={ModuleCode.CUSTOMER}
 *           onView={() => navigate(`/customer/${record.id}`)}
 *           onEdit={() => navigate(`/customer/edit/${record.id}`)}
 *           onDelete={() => handleDelete(record.id)}
 *         />
 *       )
 *     }
 *   ]}
 * />
 * ```
 */
export default function PermissionActionButtons({
  moduleCode,
  onView,
  onEdit,
  onDelete,
}: PermissionActionButtonsProps) {
  return (
    <Space size="small">
      {/* View button - requires isCanRead permission */}
      {onView && (
        <Can moduleCode={moduleCode} action="isCanRead">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={onView}
          >
            Xem
          </Button>
        </Can>
      )}

      {/* Edit button - requires isCanUpdate permission */}
      {onEdit && (
        <Can moduleCode={moduleCode} action="isCanUpdate">
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={onEdit}
          >
            Sửa
          </Button>
        </Can>
      )}

      {/* Delete button - requires isCanDelete permission */}
      {onDelete && (
        <Can moduleCode={moduleCode} action="isCanDelete">
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa?"
            onConfirm={onDelete}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              type="link" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Can>
      )}
    </Space>
  );
}
