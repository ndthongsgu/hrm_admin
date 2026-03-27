import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { EmployeeShiftAssignmentDto } from "@/dto/employeeShiftAssignment.dto";
import { useCreateEmployeeShiftAssignment, useGetEmployeeSelectOptions, useGetShiftSelectOptions } from "@/hooks/employeeShiftAssignment";
import { useRouter } from "@/routes/hooks";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import dayjs from "dayjs";

export default function AddEmployeeShiftAssignmentScreen({
  initData,
  title = "Thêm gán ca làm việc",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: EmployeeShiftAssignmentDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateEmployeeShiftAssignment } = useCreateEmployeeShiftAssignment();
  const router = useRouter();

  const { data: employees = [] } = useQuery({
    queryKey: ["employeeSelectOptions"],
    queryFn: useGetEmployeeSelectOptions,
  });

  const { data: shifts = [] } = useQuery({
    queryKey: ["shiftSelectOptions"],
    queryFn: useGetShiftSelectOptions,
  });

  const employeeOptions = useMemo(
    () =>
      employees.map((emp: any) => ({
        id: emp.id,
        name: `${emp.name}`,
      })),
    [employees]
  );

  const shiftOptions = useMemo(
    () =>
      shifts.map((shift: any) => ({
        id: shift.id,
        name: shift.name,
      })),
    [shifts]
  );

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "employeeId",
        label: "Nhân viên",
        type: "select",
        required: true,
        placeholder: "Chọn nhân viên",
        options: employeeOptions,
      },
      {
        name: "shiftId",
        label: "Ca làm việc",
        type: "select",
        required: true,
        placeholder: "Chọn ca làm việc",
        options: shiftOptions,
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
    ];
    return fields;
  }, [employeeOptions, shiftOptions]);

  const getInitialValues = useMemo(() => {
    if (!initData) {
      return {
        startDate: dayjs(),
      };
    }
    return {
      ...initData,
      startDate: initData.startDate ? dayjs(initData.startDate) : undefined,
      endDate: initData.endDate ? dayjs(initData.endDate) : undefined,
    };
  }, [initData]);

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      startDate: values.startDate ? dayjs(values.startDate).format("YYYY-MM-DD") : undefined,
      endDate: values.endDate ? dayjs(values.endDate).format("YYYY-MM-DD") : undefined,
    };

    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(formattedValues);
      }
    } else {
      onCreateEmployeeShiftAssignment(formattedValues);
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
