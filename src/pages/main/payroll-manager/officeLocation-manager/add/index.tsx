import { OFFICE_LOCATION_STATUS } from "@/common/constants/payrollPeriod";
import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { OfficeLocationDto } from "@/dto/officeLocation.dto";
import { useCreateOfficeLocation } from "@/hooks/officeLocation";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddOfficeLocationScreen({
  initData,
  title = "Thêm mới địa điểm văn phòng",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: OfficeLocationDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateOfficeLocation } = useCreateOfficeLocation();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "name",
        label: "Tên địa điểm",
        type: "input",
        required: true,
        placeholder: "Nhập tên địa điểm",
        maxLength: 255,
      },
      {
        name: "radius",
        label: "Bán kính (Radius - Mét)",
        type: "number",
        required: true,
        placeholder: "Nhập bán kính (mét)",
        min: 0,
        step: 1,
      },
      {
        name: "latitude",
        label: "Vĩ độ (Latitude)",
        type: "number",
        required: true,
        placeholder: "Nhập vĩ độ",
        step: 0.000001,
      },
      {
        name: "longitude",
        label: "Kinh độ (Longitude)",
        type: "number",
        required: true,
        placeholder: "Nhập kinh độ",
        step: 0.000001,
      },
      {
        name: "address",
        label: "Địa chỉ",
        type: "textarea",
        required: true,
        placeholder: "Nhập địa chỉ",
        maxLength: 500,
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
      onCreateOfficeLocation(values);
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
