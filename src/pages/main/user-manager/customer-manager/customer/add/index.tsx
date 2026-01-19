import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { CustomerDto } from "@/dto/customer.dto";
import { useCreateCustomer } from "@/hooks/customer";
import { useSelectCustomerTypes } from "@/hooks/customer-type";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddCustomerScreen({
  initData,
  title = "Thêm mới khách hàng",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: CustomerDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateCustomer } = useCreateCustomer();
  const { data: customerTypes, isLoading: isLoadingCustomerTypes } =
    useSelectCustomerTypes();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã khách hàng",
        type: "input",
        required: true,
        placeholder: "Nhập mã khách hàng",
      },
      {
        name: "name",
        label: "Tên khách hàng",
        type: "input",
        required: true,
        placeholder: "Nhập tên khách hàng",
      },

      {
        name: "email",
        label: "Email",
        type: "input",
        required: true,
        placeholder: "Nhập email",
      },

      {
        name: "phone",
        label: "Số điện thoại",
        type: "input",
        required: true,
        placeholder: "Nhập số điện thoại",
      },

      {
        name: "customerTypeId",
        label: "Loại khách hàng",
        type: "select",
        options: customerTypes?.map((type) => ({
          id: type.id,
          name: type.name,
          value: type.id,
        })),
        optionValue: "value",
        optionLabel: "name",
        loading: isLoadingCustomerTypes,
        required: true,
        placeholder: "Chọn loại khách hàng",
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
  }, [customerTypes, isLoadingCustomerTypes]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values);
      }
    } else {
      onCreateCustomer(values);
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
        initialValues={{
          ...initData,
          customerTypeId: initData?.customerType?.id,
        }}
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
