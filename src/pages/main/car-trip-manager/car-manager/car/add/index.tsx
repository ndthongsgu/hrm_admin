import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { CarDto } from "@/dto/car.dto";
import { useCreateCar } from "@/hooks/car";
import { useSelectCarTypes } from "@/hooks/car-type";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddCarScreen({
  initData,
  title = "Thêm mới xe",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: CarDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateCar } = useCreateCar();
  const { data: carTypes, isLoading: isLoadingCarTypes } = useSelectCarTypes();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã xe",
        type: "input",
        required: true,
        placeholder: "Nhập mã xe",
      },

      {
        name: "licensePlate",
        label: "Biển số xe",
        type: "input",
        required: true,
        placeholder: "Nhập biển số xe",
      },

      {
        name: "carTypeId",
        label: "Loại xe",
        type: "select",
        options: carTypes?.map((type) => ({
          id: type.id,
          name: type.name,
          value: type.id,
        })),
        optionValue: "value",
        optionLabel: "name",
        loading: isLoadingCarTypes,
        required: true,
        placeholder: "Chọn loại xe",
      },
    ];
    return fields;
  }, [carTypes, isLoadingCarTypes]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values);
      }
    } else {
      onCreateCar(values);
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
        gridColumns="repeat(1, 1fr)"
      />
    </BaseView>
  );
}
