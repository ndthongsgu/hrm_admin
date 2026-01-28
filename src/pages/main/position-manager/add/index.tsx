import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { PositionDto } from "@/dto/position.dto";
import { useCreatePosition } from "@/hooks/position";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddPositionScreen({
  initData,
  title = "Thêm mới chức vụ",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: PositionDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreatePosition } = useCreatePosition();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã chức vụ",
        type: "input",
        required: true,
        placeholder: "Nhập mã chức vụ",
      },
      {
        name: "name",
        label: "Tên chức vụ",
        type: "input",
        required: true,
        placeholder: "Nhập tên chức vụ",
      },
      {
        name: "level",
        label: "Cấp bậc",
        type: "input",
        required: false,
        placeholder: "Nhập cấp bậc (số)",
      },
      {
        name: "baseSalary",
        label: "Lương cơ bản",
        type: "input",
        required: false,
        placeholder: "Nhập lương cơ bản",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        required: false,
        placeholder: "Nhập mô tả chức vụ",
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
      onCreatePosition(values);
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
