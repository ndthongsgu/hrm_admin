import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { AttendanceSummaryDto } from "@/dto/payroll.dto";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddAttendanceSummaryScreen({
  initData,
  title = "Thêm mới tổng hợp công",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: AttendanceSummaryDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "payrollPeriodId",
        label: "ID Kỳ lương",
        type: "input",
        required: true,
        placeholder: "Nhập ID kỳ lương",
      },
      {
        name: "employeeId",
        label: "ID Nhân viên",
        type: "input",
        required: true,
        placeholder: "Nhập ID nhân viên",
      },
      {
        name: "actualWorkingDays",
        label: "Ngày công thực tế",
        type: "number",
        required: true,
        placeholder: "Nhập số ngày công thực tế",
      },
      {
        name: "paidLeaveDays",
        label: "Ngày nghỉ có lương",
        type: "number",
        required: true,
        placeholder: "Nhập số ngày nghỉ có lương",
      },
      {
        name: "unpaidLeaveDays",
        label: "Ngày nghỉ không lương",
        type: "number",
        required: true,
        placeholder: "Nhập số ngày nghỉ không lương",
      },
      {
        name: "overtimeHours",
        label: "Giờ làm thêm",
        type: "number",
        required: true,
        placeholder: "Nhập số giờ làm thêm",
      },
    ];
    return fields;
  }, []);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values);
      }
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
        loading={isLoadingUpdate}
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