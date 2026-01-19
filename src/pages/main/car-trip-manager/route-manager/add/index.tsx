import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { RouteDto } from "@/dto/route.dto";
import { useCreateRoute } from "@/hooks/route";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddRouteScreen({
  initData,
  title = "Thêm mới tuyến đường",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: RouteDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateRoute } = useCreateRoute();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "startLocation",
        label: "Điểm đi",
        type: "input",
        required: true,
        placeholder: "Nhập điểm đi",
      },

      {
        name: "endLocation",
        label: "Điểm đến",
        type: "input",
        required: true,
        placeholder: "Nhập điểm đến",
      },
      {
        name: "distanceKm",
        label: "Khoảng cách (km)",
        type: "number",
        required: true,
        placeholder: "Nhập khoảng cách (km)",
      },
      {
        name: "estimatedDuration",
        label: "Thời gian ước tính (phút)",
        type: "number",
        required: true,
        placeholder: "Nhập thời gian ước tính (phút)",
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
      onCreateRoute(values);
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
