import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type {
  DependentCreateDto,
  DependentDto,
  DependentUpdateDto,
} from "@/dto/dependent.dto";
import { useCreateDependent } from "@/hooks/dependent";
import { useDetailEmployee } from "@/hooks/employee";
import { useRouter } from "@/routes/hooks";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function AddDependentScreen({
  initData,
  title,
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: DependentDto;
  title?: string;
  isEdit?: boolean;
  handleUpdate?: (data: DependentUpdateDto) => void;
  isLoadingUpdate?: boolean;
}) {
  const { id: employeeId } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoading, onCreateDependent } = useCreateDependent();
  const employeeDetail = useDetailEmployee(employeeId || "");

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "fullName",
        label: "Họ và tên",
        type: "input",
        required: true,
        placeholder: "Nhập họ và tên thân nhân",
      },
      {
        name: "relationship",
        label: "Mối quan hệ",
        type: "input",
        required: true,
        placeholder: "Ví dụ: Con, Vợ, Chồng, Bố, Mẹ",
      },
      {
        name: "birthDate",
        label: "Ngày sinh",
        type: "datepicker",
        required: false,
        placeholder: "Chọn ngày sinh",
        disabledDate: (current) =>
          !!current && current.endOf("day").isAfter(dayjs()),
      },
      {
        name: "isQualified",
        label: "Được tính giảm trừ",
        type: "switch",
        required: false,
      },
    ];

    return fields;
  }, []);

  const handleSubmit = (values: DependentCreateDto) => {
    if (!employeeId) {
      router.back();
      return;
    }

    if (isEdit) {
      handleUpdate?.({
        ...values,
        employee: { id: employeeId },
      });
      return;
    }

    onCreateDependent({
      fullName: values.fullName,
      relationship: values.relationship,
      birthDate: values.birthDate,
      employee: {
        id: employeeId,
      },
      isQualified: Boolean(values.isQualified),
    });
  };

  const initialValues = useMemo(
    () => ({
      ...initData,
      isQualified: initData?.isQualified ?? true,
    }),
    [initData]
  );

  const computedTitle = useMemo(() => {
    if (title) return title;
    if (isEdit) return "Chỉnh sửa thân nhân";
    if (employeeDetail.data?.fullName) {
      return `Thêm thân nhân - ${employeeDetail.data.fullName}`;
    }
    return "Thêm thân nhân";
  }, [employeeDetail.data?.fullName, isEdit, title]);

  return (
    <BaseView>
      <FormCustom
        title={computedTitle}
        fields={formFields}
        initialValues={initialValues}
        loading={isLoading || isLoadingUpdate}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        submitText="Lưu"
        cancelText="Thoát"
        gap="20px"
        gridColumns="repeat(2, 1fr)"
      />
    </BaseView>
  );
}
