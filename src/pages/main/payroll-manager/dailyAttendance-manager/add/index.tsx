import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { DailyAttendanceDto } from "@/dto/payroll.dto";
import { useCreateDailyAttendance } from "@/hooks/payroll/dailyAttendance";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useGetEmployeeSelectOptions } from "@/hooks/employeeShiftAssignment";
import { useQuery } from "@tanstack/react-query";

export default function AddDailyAttendanceScreen({
  initData,
  title = "Thêm chấm công",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: DailyAttendanceDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateDailyAttendance } = useCreateDailyAttendance();
  const router = useRouter();
  const { data: employees = [] } = useQuery({
    queryKey: ["employeeSelectOptions"],
    queryFn: useGetEmployeeSelectOptions,
  });

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "employeeId",
        label: "Nhân viên",
        type: "select",
        required: true,
        placeholder: "Chọn nhân viên",
        options: employees.map((emp) => ({
          id: emp.id,
          name: `${emp.name}`,
          value: emp.id,
        })),
      },
      {
        name: "date",
        label: "Ngày chấm công",
        type: "datepicker",
        required: true,
        placeholder: "Chọn ngày",
      },
      {
        name: "checkInTime",
        label: "Giờ vào",
        type: "timePicker",
        placeholder: "Chọn giờ vào",
      },
      {
        name: "checkOutTime",
        label: "Giờ ra",
        type: "timePicker",
        placeholder: "Chọn giờ ra",
      },
      {
        name: "status",
        label: "Trạng thái",
        type: "select",
        required: true,
        placeholder: "Chọn trạng thái",
        options: [
          { id: "OK", name: "Có mặt", value: "OK" },
          { id: "LATE", name: "Đi muộn", value: "LATE" },
          { id: "ABSENT", name: "Vắng mặt", value: "ABSENT" },
          { id: "LEAVE", name: "Nghỉ phép", value: "LEAVE" },
          { id: "EARLY", name: "Về sớm", value: "EARLY" },
        ],
      },
    ];
    return fields;
  }, [employees]);

  // Convert date to dayjs for form initialization
  const getInitialValues = useMemo(() => {
    if (!initData) return undefined;
    return {
      ...initData,
      date: initData.date ? dayjs(initData.date) : undefined,
      checkInTime: initData.checkInTime ? dayjs(initData.checkInTime) : undefined,
      checkOutTime: initData.checkOutTime ? dayjs(initData.checkOutTime) : undefined,
    };
  }, [initData]);

  const handleSubmit = (values: any) => {
    const dateStr = values.date ? dayjs(values.date).format("YYYY-MM-DD") : undefined;
    const checkInTimeStr = values.checkInTime ? dayjs(values.checkInTime).format("HH:mm:ss") : undefined;
    const checkOutTimeStr = values.checkOutTime ? dayjs(values.checkOutTime).format("HH:mm:ss") : undefined;

    const formattedValues = {
      ...values,
      date: dateStr,
      checkInTime: dateStr && checkInTimeStr ? `${dateStr}T${checkInTimeStr}` : undefined,
      checkOutTime: dateStr && checkOutTimeStr ? `${dateStr}T${checkOutTimeStr}` : undefined,
    };

    if (isEdit) {
      if (handleUpdate) {
        // For update, include id and version from initData
        const updateData = {
          ...formattedValues,
          id: initData?.id,
          version: initData?.version,
        };
        handleUpdate(updateData);
      }
    } else {
      onCreateDailyAttendance(formattedValues);
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