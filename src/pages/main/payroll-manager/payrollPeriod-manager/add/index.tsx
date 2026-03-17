import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { PayrollPeriodDto } from "@/dto/payroll.dto";
import { useCreatePayrollPeriod } from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";
import dayjs from "dayjs";

export default function AddPayrollPeriodScreen({
  initData,
  title = "Thêm mới kỳ lương",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: PayrollPeriodDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreatePayrollPeriod } = useCreatePayrollPeriod();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "name",
        label: "Tên kỳ lương",
        type: "input",
        required: true,
        placeholder: "Nhập tên kỳ lương",
      },
      {
        name: "dateRange",
        label: "Khoảng ngày tính lương",
        type: "dateRangePicker",
        required: true,
        placeholder: "Chọn khoảng ngày",
      },
      {
        name: "standardWorkingDays",
        label: "Số ngày công chuẩn",
        type: "number",
        required: true,
        min: 0,
        max: 31,
        placeholder: "Nhập số ngày công chuẩn",
      },
    ];
    return fields;
  }, []);

  // Convert startDate/endDate to dateRange for form initialization
  const getInitialValues = useMemo(() => {
    if (!initData) return undefined;
    return {
      ...initData,
      dateRange: initData.startDate && initData.endDate 
        ? [initData.startDate, initData.endDate]
        : undefined,
    };
  }, [initData]);

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      startDate: values.dateRange?.[0] ? dayjs(values.dateRange[0]).format("YYYY-MM-DD") : undefined,
      endDate: values.dateRange?.[1] ? dayjs(values.dateRange[1]).format("YYYY-MM-DD") : undefined,
    };
    // Remove dateRange as it's not part of the API schema
    delete formattedValues.dateRange;

    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(formattedValues);
      }
    } else {
      onCreatePayrollPeriod(formattedValues);
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
        initialValues={getInitialValues}
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

