import BaseView from "@/components/base-view/BaseView";
import FormCustom, { type FormField } from "@/components/form-custom";
import Loading from "@/components/loading/Loading";
import {
  useAllowanceTypes,
  useContracts,
  useDetailContractAllowance,
  useUpdateContractAllowance,
} from "@/hooks/contract";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function EditContractAllowanceScreen() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useDetailContractAllowance(id ?? "");
  const updateContractAllowanceMutation = useUpdateContractAllowance();
  const { data: contracts } = useContracts({ skip: 0, take: 200, where: {} });
  const { data: allowanceTypes } = useAllowanceTypes({ skip: 0, take: 200, where: {} });

  const fields = useMemo(() => {
    const formFields: FormField[] = [
      {
        name: "contractId",
        label: "Hợp đồng",
        type: "select",
        required: true,
        placeholder: "Chọn hợp đồng",
        showSearch: true,
        options: contracts.map((item) => ({
          id: item.id,
          name: `${item.contractNumber || "N/A"} - ${item.employee?.fullName || item.employee?.name || "N/A"}`,
        })),
      },
      {
        name: "allowanceTypeId",
        label: "Loại phụ cấp",
        type: "select",
        required: true,
        placeholder: "Chọn loại phụ cấp",
        showSearch: true,
        options: allowanceTypes.map((item) => ({
          id: item.id,
          name: item.name,
        })),
      },
      {
        name: "amount",
        label: "Số tiền",
        type: "number",
        required: true,
        min: 0,
      },
    ];

    return formFields;
  }, [allowanceTypes, contracts]);

  if (isLoading) return <Loading />;

  return (
    <BaseView>
      <FormCustom
        title="Cập nhật phụ cấp theo hợp đồng"
        fields={fields}
        initialValues={data}
        loading={updateContractAllowanceMutation.isPending}
        onSubmit={async (values) => {
          await updateContractAllowanceMutation.mutateAsync({
            id: id ?? "",
            body: {
              contractId: values.contractId,
              allowanceTypeId: values.allowanceTypeId,
              amount: values.amount,
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
