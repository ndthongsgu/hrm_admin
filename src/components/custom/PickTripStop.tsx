import FormCustom, { type FormField } from "@/components/form-custom";
import { useMemo } from "react";

export interface PickupStopFormProps {
  initData?: any;
  loading?: boolean;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export default function PickupStopForm({
  initData,
  loading,
  onSubmit,
  onCancel,
}: PickupStopFormProps) {
  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "stopType",
        label: "Loại điểm dừng",
        type: "select",
        options: [
          { id: "PICKUP", name: "Điểm đón", value: "PICKUP" },
          { id: "DROPOFF", name: "Điểm trả", value: "DROPOFF" },
        ],
        placeholder: "Chọn loại điểm dừng",
        required: true,
      },
      {
        name: "location",
        label: "Địa điểm",
        type: "input",
        placeholder: "Thêm địa điểm",
        required: true,
      },
      {
        name: "orderIndex",
        label: "Thứ tự điểm dừng",
        type: "input",
        placeholder: "Thêm thứ tự điểm dừng",
        required: true,
      },
    ];
    return fields;
  }, []);

  return (
    <FormCustom
      fields={formFields}
      initialValues={initData}
      loading={loading}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitText="Lưu"
      cancelText="Đóng"
      gridColumns="repeat(2, 1fr)"
    />
  );
}
