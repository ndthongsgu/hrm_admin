import { SALARY_ADJUSTMENT_TYPE } from "@/common/constants/payrollPeriod";
import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { SalaryAdjustmentDto } from "@/dto/payroll.dto";
import { useCreateSalaryAdjustment, usePayrollPeriodSelectOptions, useEmployeeSelectOptions } from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddSalaryAdjustmentScreen({
  initData,
  title = "Thêm mới điều chỉnh lương",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: SalaryAdjustmentDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateSalaryAdjustment } = useCreateSalaryAdjustment();
  const router = useRouter();
  const { data: payrollPeriodOptions, isLoading: isLoadingPayrollPeriods } = usePayrollPeriodSelectOptions();
  const { data: employeeOptions, isLoading: isLoadingEmployees } = useEmployeeSelectOptions();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "payrollPeriodId",
        label: "Kỳ lương",
        type: "select",
        required: true,
        placeholder: "Chọn kỳ lương",
        options: payrollPeriodOptions || [],
        loading: isLoadingPayrollPeriods,
      },
      {
        name: "employeeId",
        label: "Nhân viên",
        type: "select",
        required: true,
        placeholder: "Chọn nhân viên",
        options: employeeOptions || [],
        loading: isLoadingEmployees,
      },
      {
        name: "amount",
        label: "Số tiền",
        type: "number",
        required: true,
        min: 0,
        step: 1000,
        placeholder: "Nhập số tiền (âm cho khấu trừ)",
      },
      {
        name: "type",
        label: "Loại điều chỉnh",
        type: "select",
        required: true,
        placeholder: "Chọn loại điều chỉnh",
        options: Object.values(SALARY_ADJUSTMENT_TYPE).map((v) => ({
          name: v.label,
          id: v.value,
        })),
      },
      {
        name: "reason",
        label: "Lý do",
        type: "textarea",
        required: true,
        placeholder: "Nhập lý do điều chỉnh",
      },
      {
        name: "isTaxable",
        label: "Chịu thuế",
        type: "switch",
        defaultValue: true,
      },
      {
        name: "isNetOnly",
        label: "Chỉ áp dụng cho lương net",
        type: "switch",
        defaultValue: false,
      },
    ];
    return fields;
  }, [payrollPeriodOptions, employeeOptions, isLoadingPayrollPeriods, isLoadingEmployees]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values);
      }
    } else {
      onCreateSalaryAdjustment(values);
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