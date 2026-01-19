import BaseView from "@/components/base-view/BaseView";
import type { RoleDto } from "@/dto/role.dto";
import { useRoleDetail, useUpdateRole } from "@/hooks/role"; // Giả sử có hook này để fetch role by ID
import { Alert, Spin } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddRoleScreen from "../add";

export default function EditRoleScreen() {
  const { id } = useParams<{ id: string }>(); // Lấy ID từ route params, ví dụ /role/edit/:id
  const {
    data: roleData,
    isLoading: isLoadingRole,
    error: fetchError,
  } = useRoleDetail(id || "");
  const { onUpdateRole, isLoading: isUpdating } = useUpdateRole(id || "");
  const [error, setError] = useState<string | null>(null);

  // Handle fetch error
  useEffect(() => {
    if (fetchError) {
      setError(
        `Không tải được dữ liệu vai trò: ${
          fetchError.message || "Lỗi không xác định"
        }`
      );
    }
  }, [fetchError]);

  const handleUpdate = (values: RoleDto) => {
    if (!id) {
      setError("Không tìm thấy ID vai trò");
      return;
    }
    onUpdateRole({ ...values });
  };

  if (error) {
    return (
      <BaseView>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ margin: "20px 0" }}
        />
      </BaseView>
    );
  }

  if (isLoadingRole) {
    return (
      <BaseView>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "50px" }}
        >
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </BaseView>
    );
  }

  if (!roleData) {
    return (
      <BaseView>
        <Alert
          message="Không tìm thấy"
          description="Vai trò không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
          style={{ margin: "20px 0" }}
        />
      </BaseView>
    );
  }

  return (
    <BaseView>
      <AddRoleScreen
        initData={roleData}
        title="Chỉnh sửa vai trò"
        isEdit={true}
        handleUpdate={handleUpdate}
        isLoadingUpdate={isUpdating}
      />
    </BaseView>
  );
}
