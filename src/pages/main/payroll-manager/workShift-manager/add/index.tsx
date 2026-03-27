import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { WorkShiftDto } from "@/dto/workshift.dto";
import { useCreateWorkShift } from "@/hooks/workshift";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";
import dayjs from "dayjs";

export default function AddWorkShiftScreen({
  initData,
  title = "Thêm mới ca làm việc",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: WorkShiftDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateWorkShift } = useCreateWorkShift();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "name",
        label: "Tên ca làm việc",
        type: "input",
        required: true,
        placeholder: "Nhập tên ca làm việc",
      },
      {
        name: "startTime",
        label: "Giờ bắt đầu",
        type: "timePicker",
        required: true,
        placeholder: "Chọn giờ bắt đầu",
      },
      {
        name: "endTime",
        label: "Giờ kết thúc",
        type: "timePicker",
        required: true,
        placeholder: "Chọn giờ kết thúc",
      },
      {
        name: "breakStart",
        label: "Giờ bắt đầu nghỉ",
        type: "timePicker",
        placeholder: "Chọn giờ bắt đầu nghỉ",
      },
      {
        name: "breakEnd",
        label: "Giờ kết thúc nghỉ",
        type: "timePicker",
        placeholder: "Chọn giờ kết thúc nghỉ",
      },
      {
        name: "lateGraceMinutes",
        label: "Dung sai muộn (phút)",
        type: "number",
        min: 0,
        max: 120,
        placeholder: "Nhập dung sai muộn",
      },
      {
        name: "earlyLeaveGraceMinutes",
        label: "Dung sai về sớm (phút)",
        type: "number",
        min: 0,
        max: 120,
        placeholder: "Nhập dung sai về sớm",
      },
    ];
    return fields;
  }, []);

  // Convert time strings for form initialization
  const getInitialValues = useMemo(() => {
    if (!initData) {
      return {
        lateGraceMinutes: 15,
        earlyLeaveGraceMinutes: 0,
      };
    }
    return {
      ...initData,
      startTime: initData.startTime ? dayjs(initData.startTime, "HH:mm") : undefined,
      endTime: initData.endTime ? dayjs(initData.endTime, "HH:mm") : undefined,
      breakStart: initData.breakStart ? dayjs(initData.breakStart, "HH:mm") : undefined,
      breakEnd: initData.breakEnd ? dayjs(initData.breakEnd, "HH:mm") : undefined,
    };
  }, [initData]);

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      startTime: values.startTime ? dayjs(values.startTime).format("HH:mm") : undefined,
      endTime: values.endTime ? dayjs(values.endTime).format("HH:mm") : undefined,
      breakStart: values.breakStart ? dayjs(values.breakStart).format("HH:mm") : undefined,
      breakEnd: values.breakEnd ? dayjs(values.breakEnd).format("HH:mm") : undefined,
    };

    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(formattedValues);
      }
    } else {
      onCreateWorkShift(formattedValues);
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
