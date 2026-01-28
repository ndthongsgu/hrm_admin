import BaseView from "@/components/base-view/BaseView";
import type { UserDto } from "@/dto/user.dto";
import { useDetailUser, useUpdateUser } from "@/hooks/user";
import { Alert, Spin } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddUserScreen from "../add";

export default function EditUserScreen() {
  const { id } = useParams<{ id: string }>();
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: fetchError,
  } = useDetailUser(id || "");
  const { onUpdateUser, isLoading: isUpdating } = useUpdateUser(id || "");
  const [error, setError] = useState<string | null>(null);

  // Handle fetch error
  useEffect(() => {
    if (fetchError) {
      setError(
        `Không tải được dữ liệu người dùng: ${
          fetchError.message || "Lỗi không xác định"
        }`
      );
    }
  }, [fetchError]);

  const handleUpdate = (values: UserDto) => {
    if (!id) {
      setError("Không tìm thấy ID người dùng");
      return;
    }
    // Transform data for update (exclude password, username)
    const updateData = {
      email: values.email,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      roleIds: values.roles?.map((role) => role.id) || [],
      isActive: values.isActive,
    };
    onUpdateUser(updateData);
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

  if (isLoadingUser) {
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

  if (!userData) {
    return (
      <BaseView>
        <Alert
          message="Không tìm thấy"
          description="Người dùng không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
          style={{ margin: "20px 0" }}
        />
      </BaseView>
    );
  }

  return (
    <BaseView>
      <AddUserScreen
        initData={userData}
        title="Chỉnh sửa người dùng"
        isEdit={true}
        handleUpdate={handleUpdate}
        isLoadingUpdate={isUpdating}
      />
    </BaseView>
  );
}
