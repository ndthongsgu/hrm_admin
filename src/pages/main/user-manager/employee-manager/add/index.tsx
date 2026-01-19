import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { EmployeeDto } from "@/dto/employee.dto";
import { useCreateEmployee } from "@/hooks/employee";
import { useSelectBoxRoles } from "@/hooks/role";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddEmployeeScreen({
  initData,
  title = "Thêm mới nhân viên",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: EmployeeDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateEmployee } = useCreateEmployee();
  const { data: roles = [] } = useSelectBoxRoles();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã nhân viên",
        type: "input",
        required: true,
        placeholder: "Nhập mã nhân viên",
      },
      {
        name: "name",
        label: "Tên nhân viên",
        type: "input",
        required: true,
        placeholder: "Nhập tên nhân viên",
      },
      {
        name: "email",
        label: "Email",
        type: "input",
        required: true,
        placeholder: "Nhập email",
      },
      {
        name: "phone",
        label: "Số điện thoại",
        type: "input",
        required: true,
        placeholder: "Nhập số điện thoại",
      },
      {
        name: "roleIds",
        label: "Vai trò",
        type: "multiselect",
        required: false,
        placeholder: "Chọn vai trò",
        options: roles.map((role) => ({
          label: role.name,
          name: role.name,
          value: role.id,
          id: role.id,
        })),
        gridColumn: "1 / -1",
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
  }, [roles]);

  const handleSubmit = (values: any) => {
    const submitData = {
      ...values,
      roleIds: values.roleIds || [], // Ensure roleIds is always an array
    };

    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(submitData);
      }
    } else {
      onCreateEmployee(submitData);
    }
  };

  const goBack = () => {
    router.back();
  };

  // Prepare initial values with role IDs
  const initialValues = useMemo(() => {
    if (!initData) return undefined;

    return {
      ...initData,
      roleIds: initData.roles?.map((role) => role.id) || [],
    };
  }, [initData]);

  return (
    <BaseView>
      <FormCustom
        title={title}
        fields={formFields}
        initialValues={initialValues}
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
