import BaseView from "@/components/base-view/BaseView";
import FormCustom, { type FormField } from "@/components/form-custom";
import Loading from "@/components/loading/Loading";
import {
  useDetailContract,
  useEmployeeOptions,
  usePositionOptions,
  useUpdateContract,
} from "@/hooks/contract";
import { useRouter } from "@/routes/hooks";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const CONTRACT_STATUSES = [
  { id: "ACTIVE", name: "ACTIVE", value: "ACTIVE" },
  { id: "EXPIRED", name: "EXPIRED", value: "EXPIRED" },
];

export default function EditContractScreen() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useDetailContract(id ?? "");
  const updateContractMutation = useUpdateContract();
  const { data: employeeOptions, isLoading: loadingEmployees } = useEmployeeOptions();
  const { data: positionOptions, isLoading: loadingPositions } = usePositionOptions();

  const fields = useMemo(() => {
    const formFields: FormField[] = [
      {
        name: "employeeId",
        label: "Nhân viên",
        type: "select",
        required: true,
        placeholder: "Chọn nhân viên",
        showSearch: true,
        loading: loadingEmployees,
        options: employeeOptions.map((item) => ({
          id: item.id,
          name: item.name,
        })),
      },
      {
        name: "contractNumber",
        label: "Số hợp đồng",
        type: "input",
        required: true,
        placeholder: "VD: HD-2026-0001",
      },
      {
        name: "positionId",
        label: "Vị trí",
        type: "select",
        required: true,
        placeholder: "Chọn vị trí",
        showSearch: true,
        loading: loadingPositions,
        options: positionOptions.map((item) => ({
          id: item.id,
          name: item.name,
        })),
      },
      {
        name: "baseSalary",
        label: "Lương đóng BH",
        type: "number",
        required: true,
        min: 0,
      },
      {
        name: "actualSalary",
        label: "Lương hợp đồng",
        type: "number",
        required: true,
        min: 0,
      },
      {
        name: "isNet",
        label: "Net salary",
        type: "switch",
        defaultValue: false,
      },
      {
        name: "startDate",
        label: "Ngày bắt đầu",
        type: "datepicker",
        required: true,
        placeholder: "Chọn ngày bắt đầu",
      },
      {
        name: "endDate",
        label: "Ngày kết thúc",
        type: "datepicker",
        placeholder: "Chọn ngày kết thúc",
      },
      {
        name: "status",
        label: "Trạng thái",
        type: "select",
        required: true,
        placeholder: "Trạng thái",
        options: CONTRACT_STATUSES,
      },
    ];

    return formFields;
  }, [employeeOptions, loadingEmployees, loadingPositions, positionOptions]);

  if (isLoading) return <Loading />;

  const initialValues = {
    ...data,
    employeeId: data?.employee?.id,
    positionId: data?.position?.id,
  };

  return (
    <BaseView>
      <FormCustom
        title="Cập nhật hợp đồng"
        fields={fields}
        initialValues={initialValues}
        loading={updateContractMutation.isPending}
        onSubmit={async (values) => {
          await updateContractMutation.mutateAsync({
            id: id ?? "",
            body: {
              employeeId: values.employeeId,
              contractNumber: values.contractNumber,
              baseSalary: values.baseSalary,
              actualSalary: values.actualSalary,
              positionId: values.positionId || null,
              startDate: values.startDate
                ? dayjs(values.startDate).format("YYYY-MM-DD")
                : undefined,
              endDate: values.endDate
                ? dayjs(values.endDate).format("YYYY-MM-DD")
                : undefined,
              status: values.status,
              isNet: Boolean(values.isNet),
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
