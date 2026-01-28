import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { UserDto } from "@/dto/user.dto";
import { useCreateUser } from "@/hooks/user";
import { useAllRoles } from "@/hooks/role";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddUserScreen({
  initData,
  title = "Thêm mới người dùng",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: UserDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateUser } = useCreateUser();
  const { data: roles } = useAllRoles();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "username",
        label: "Tên đăng nhập",
        type: "input",
        required: true,
        placeholder: "Nhập tên đăng nhập",
        disabled: isEdit, // Không cho sửa username khi edit
      },
      {
        name: "email",
        label: "Email",
        type: "input",
        required: true,
        placeholder: "Nhập email",
        inputType: "email",
      },
      {
        name: "password",
        label: "Mật khẩu",
        type: "input",
        required: !isEdit, // Chỉ required khi tạo mới
        placeholder: "Nhập mật khẩu",
        inputType: "password",
        hidden: isEdit, // Ẩn password field khi edit
      },
      {
        name: "fullName",
        label: "Họ tên",
        type: "input",
        required: false,
        placeholder: "Nhập họ tên",
      },
      {
        name: "phoneNumber",
        label: "Số điện thoại",
        type: "input",
        required: false,
        placeholder: "Nhập số điện thoại",
        inputType: "tel",
      },
      {
        name: "roleIds",
        label: "Vai trò",
        type: "select",
        required: true,
        placeholder: "Chọn vai trò",
        mode: "multiple",
        options:
          roles?.map((role) => ({
            label: role.name,
            value: role.id,
          })) || [],
      },
    ];
    return fields;
  }, [isEdit, roles]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values);
      }
    } else {
      onCreateUser(values);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <BaseView>
      <FormCustom
        title={title}
        fields={formFields}
        initialValues={initData}
        loading={isLoading || isLoadingUpdate}
        onSubmit={handleSubmit}
        onCancel={goBack}
        submitText="Lưu"
        cancelText="Thoát"
        gap="20px"
        gridColumns="repeat(2, 1fr)"
      />
    </BaseView>
  );
}
