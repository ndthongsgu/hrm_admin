import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { PaymentMethodDto } from "@/dto/paymentMethod.dto";
import { useCreatePaymentMethod } from "@/hooks/payment-method";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddPaymentMethodScreen({
  initData,
  title = "Thêm mới phương thức thanh toán",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: PaymentMethodDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreatePaymentMethod } = useCreatePaymentMethod();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã phương thức",
        type: "input",
        required: true,
        placeholder: "Nhập mã phương thức",
      },
      {
        name: "name",
        label: "Tên phương thức",
        type: "input",
        required: true,
        placeholder: "Nhập tên phương thức",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả",
      },
      {
        name: "isDeleted",
        label: "Trạng thái",
        type: "select",
        required: true,
        placeholder: "Chọn trạng thái",
        options: [
          { id: "false", name: "Hoạt động", value: false },
          { id: "true", name: "Không hoạt động", value: true },
        ],
        optionValue: "value",
        optionLabel: "name",
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
      onCreatePaymentMethod(values);
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
        initialValues={initData || { isDeleted: true }}
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
