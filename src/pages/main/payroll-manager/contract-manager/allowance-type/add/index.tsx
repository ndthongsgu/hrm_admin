import BaseView from "@/components/base-view/BaseView";
import FormCustom, { type FormField } from "@/components/form-custom";
import { useCreateAllowanceType } from "@/hooks/contract";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddAllowanceTypeScreen() {
  const router = useRouter();
  const createAllowanceTypeMutation = useCreateAllowanceType();

  const fields = useMemo(() => {
    const formFields: FormField[] = [
      {
        name: "name",
        label: "Tên loại phụ cấp",
        type: "input",
        required: true,
        placeholder: "VD: Phụ cấp trách nhiệm",
      },
      {
        name: "isTaxable",
        label: "Tính thuế",
        type: "switch",
        defaultValue: true,
      },
      {
        name: "isInsuranceBased",
        label: "Tính bảo hiểm",
        type: "switch",
        defaultValue: true,
      },
    ];

    return formFields;
  }, []);

  return (
    <BaseView>
      <FormCustom
        title="Thêm loại phụ cấp"
        fields={fields}
        loading={createAllowanceTypeMutation.isPending}
        onSubmit={async (values) => {
          await createAllowanceTypeMutation.mutateAsync({
            name: values.name,
            isTaxable: Boolean(values.isTaxable),
            isInsuranceBased: Boolean(values.isInsuranceBased),
          });
          router.back();
        }}
        onCancel={() => router.back()}
        submitText="Lưu"
        cancelText="Thoát"
        gap="20px"
        gridColumns="repeat(2, 1fr)"
        formStyle={{ marginTop: 8 }}
      />
    </BaseView>
  );
}
