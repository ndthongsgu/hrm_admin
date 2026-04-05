import BaseView from "@/components/base-view/BaseView";
import FormCustom, { type FormField } from "@/components/form-custom";
import Loading from "@/components/loading/Loading";
import { useDetailAllowanceType, useUpdateAllowanceType } from "@/hooks/contract";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function EditAllowanceTypeScreen() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useDetailAllowanceType(id ?? "");
  const updateAllowanceTypeMutation = useUpdateAllowanceType();

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

  if (isLoading) return <Loading />;

  return (
    <BaseView>
      <FormCustom
        title="Cập nhật loại phụ cấp"
        fields={fields}
        initialValues={data}
        loading={updateAllowanceTypeMutation.isPending}
        onSubmit={async (values) => {
          await updateAllowanceTypeMutation.mutateAsync({
            id: id ?? "",
            body: {
              name: values.name,
              isTaxable: Boolean(values.isTaxable),
              isInsuranceBased: Boolean(values.isInsuranceBased),
            },
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
