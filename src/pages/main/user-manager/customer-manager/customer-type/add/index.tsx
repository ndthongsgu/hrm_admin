import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { CustomerTypeDto } from "@/dto/customerType.dto";
import { useCreateCustomerType } from "@/hooks/customer-type";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddCustomerTypeScreen({
  initData,
  title = "Thêm mới loại khách hàng",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: CustomerTypeDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateCustomerType } = useCreateCustomerType();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã loại khách hàng",
        type: "input",
        required: true,
        placeholder: "Nhập mã loại khách hàng",
      },
      {
        name: "name",
        label: "Tên loại khách hàng",
        type: "input",
        required: true,
        placeholder: "Nhập tên loại khách hàng",
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
      onCreateCustomerType(values);
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
