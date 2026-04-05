import BaseView from "@/components/base-view/BaseView";
import FormCustom, { type FormField } from "@/components/form-custom";
import {
  useCreateContract,
  useEmployeeOptions,
  usePositionOptions,
} from "@/hooks/contract";
import { useRouter } from "@/routes/hooks";
import dayjs from "dayjs";
import { useMemo } from "react";

const CONTRACT_STATUSES = [
  { id: "ACTIVE", name: "ACTIVE", value: "ACTIVE" },
  { id: "EXPIRED", name: "EXPIRED", value: "EXPIRED" },
];

export default function AddContractScreen() {
  const router = useRouter();
  const createContractMutation = useCreateContract();
  const { data: employeeOptions, isLoading: loadingEmployees } =
    useEmployeeOptions();
  const { data: positionOptions, isLoading: loadingPositions } =
    usePositionOptions();

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
        gridColumn: "span 1",
      },
      {
        name: "actualSalary",
        label: "Lương hợp đồng",
        type: "number",
        required: true,
        min: 0,
        gridColumn: "span 1",
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
        gridColumn: "span 1",
      },
      {
        name: "endDate",
        label: "Ngày kết thúc",
        type: "datepicker",
        placeholder: "Chọn ngày kết thúc",
        gridColumn: "span 1",
      },
      {
        name: "status",
        label: "Trạng thái",
        type: "select",
        required: true,
        placeholder: "Trạng thái",
        options: CONTRACT_STATUSES,
        gridColumn: "span 1",
      },
    ];

    return formFields;
  }, [employeeOptions, loadingEmployees, loadingPositions, positionOptions]);

  return (
    <BaseView>
      <FormCustom
        title="Thêm hợp đồng"
        fields={fields}
        loading={createContractMutation.isPending}
        onSubmit={async (values) => {
          const payload = {
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
          };

          await createContractMutation.mutateAsync(payload);
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
