import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { RoleDto } from "@/dto/role.dto";
import { useCreateRole } from "@/hooks/role";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddRoleScreen({
  initData,
  title = "Thêm mới vai trò",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: RoleDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateRole } = useCreateRole();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã vai trò",
        type: "input",
        required: true,
        placeholder: "Nhập mã vai trò",
      },
      {
        name: "name",
        label: "Tên vai trò",
        type: "input",
        required: true,
        placeholder: "Nhập tên vai trò",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả",
        gridColumn: "1 / -1",
      },
    ];
    return fields;
  }, []);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values);
      }
    } else {
      onCreateRole(values);
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
