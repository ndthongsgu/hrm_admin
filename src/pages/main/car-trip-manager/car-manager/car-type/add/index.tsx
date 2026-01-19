import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { CarTypeDto } from "@/dto/carType.dto";
import { useCreateCarType } from "@/hooks/car-type";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddCarTypeScreen({
  initData,
  title = "Thêm mới loại xe",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: CarTypeDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateCarType } = useCreateCarType();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã loại xe",
        type: "input",
        required: true,
        placeholder: "Nhập mã loại xe",
      },
      {
        name: "name",
        label: "Tên loại xe",
        type: "input",
        required: true,
        placeholder: "Nhập tên loại xe",
      },
      {
        name: "seatCount",
        label: "Số ghế",
        type: "input",
        required: true,
        placeholder: "Nhập số ghế",
      },

      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả",
        gridColumn: "1 / -1",
      },
    ];
    return fields;
  }, []);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values);
      }
    } else {
      onCreateCarType(values);
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
        gridColumns="repeat(3, 1fr)"
      />
    </BaseView>
  );
}
