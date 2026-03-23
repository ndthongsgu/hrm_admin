import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { DepartmentDto } from "@/dto/department.dto";
import { useCreateDepartment, useSelectBoxDepartments } from "@/hooks/department";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddDepartmentScreen({
  initData,
  title = "Thêm mới phòng ban",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: DepartmentDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateDepartment } = useCreateDepartment();
  const { data: departments = [] } = useSelectBoxDepartments();
  const router = useRouter();

  const initialValues = useMemo(
    () => ({
      ...initData,
      parentDepartmentId:
        initData?.parentDepartmentId ?? initData?.parent?.id ?? undefined,
    }),
    [initData]
  );

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã phòng ban",
        type: "input",
        required: true,
        placeholder: "Nhập mã phòng ban",
      },
      {
        name: "name",
        label: "Tên phòng ban",
        type: "input",
        required: true,
        placeholder: "Nhập tên phòng ban",
      },
      {
        name: "parentDepartmentId",
        label: "Phòng ban cha",
        type: "select",
        required: false,
        placeholder: "Chọn phòng ban cha (nếu có)",
        options: departments
          .filter((dept) => dept.id !== initData?.id) // Don't allow selecting itself
          .map((dept) => ({
            label: dept.name,
            name: dept.name,
            value: dept.id,
            id: dept.id,
          })),
      },
      {
        name: "managerId",
        label: "Trưởng phòng",
        type: "input",
        required: false,
        placeholder: "Nhập ID người quản lý (tạm thời)",
        gridColumn: "1 / -1",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả phòng ban",
        gridColumn: "1 / -1",
      },
    ];
    return fields;
  }, [departments, initData?.id]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values);
      }
    } else {
      onCreateDepartment(values);
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
