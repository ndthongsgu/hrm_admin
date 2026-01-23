import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { EmployeeDto } from "@/dto/employee.dto";
import { useCreateEmployee } from "@/hooks/employee";
import { useSelectBoxDepartments } from "@/hooks/department";
import { useSelectBoxPositions } from "@/hooks/position";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddEmployeeScreen({
  initData,
  title = "Thêm mới nhân viên",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: EmployeeDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateEmployee } = useCreateEmployee();
  const { data: departments = [] } = useSelectBoxDepartments();
  const { data: positions = [] } = useSelectBoxPositions();
  const router = useRouter();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "code",
        label: "Mã nhân viên",
        type: "input",
        required: true,
        placeholder: "Nhập mã nhân viên",
      },
      {
        name: "fullName",
        label: "Họ và tên",
        type: "input",
        required: true,
        placeholder: "Nhập họ và tên",
      },
      {
        name: "email",
        label: "Email",
        type: "input",
        required: false,
        placeholder: "Nhập email",
      },
      {
        name: "phoneNumber",
        label: "Số điện thoại",
        type: "input",
        required: false,
        placeholder: "Nhập số điện thoại",
      },
      {
        name: "dateOfBirth",
        label: "Ngày sinh",
        type: "datepicker",
        required: false,
        placeholder: "Chọn ngày sinh",
      },
      {
        name: "gender",
        label: "Giới tính",
        type: "select",
        required: false,
        placeholder: "Chọn giới tính",
        options: [
          { id: "MALE", name: "Nam", value: "MALE" },
          { id: "FEMALE", name: "Nữ", value: "FEMALE" },
          { id: "OTHER", name: "Khác", value: "OTHER" },
        ],
      },
      {
        name: "departmentId",
        label: "Phòng ban",
        type: "select",
        required: false,
        placeholder: "Chọn phòng ban",
        options: departments.map((dept) => ({
          label: dept.name,
          name: dept.name,
          value: dept.id,
          id: dept.id,
        })),
      },
      {
        name: "positionId",
        label: "Chức vụ",
        type: "select",
        required: false,
        placeholder: "Chọn chức vụ",
        options: positions.map((pos) => ({
          label: pos.name,
          name: pos.name,
          value: pos.id,
          id: pos.id,
        })),
      },
      {
        name: "hireDate",
        label: "Ngày vào làm",
        type: "datepicker",
        required: false,
        placeholder: "Chọn ngày vào làm",
      },
      {
        name: "taxCode",
        label: "Mã số thuế",
        type: "input",
        required: false,
        placeholder: "Nhập mã số thuế",
      },
      {
        name: "socialInsuranceNumber",
        label: "Số BHXH",
        type: "input",
        required: false,
        placeholder: "Nhập số bảo hiểm xã hội",
      },
      {
        name: "healthInsuranceNumber",
        label: "Số BHYT",
        type: "input",
        required: false,
        placeholder: "Nhập số bảo hiểm y tế",
      },
      {
        name: "bankAccount",
        label: "Số tài khoản",
        type: "input",
        required: false,
        placeholder: "Nhập số tài khoản ngân hàng",
      },
      {
        name: "bankName",
        label: "Ngân hàng",
        type: "input",
        required: false,
        placeholder: "Nhập tên ngân hàng",
      },
      {
        name: "address",
        label: "Địa chỉ",
        type: "textarea",
        required: false,
        placeholder: "Nhập địa chỉ",
        gridColumn: "1 / -1",
      },
      {
        name: "emergencyContact",
        label: "Người liên hệ khẩn cấp",
        type: "input",
        required: false,
        placeholder: "Nhập tên người liên hệ khẩn cấp",
      },
      {
        name: "emergencyPhone",
        label: "SĐT khẩn cấp",
        type: "input",
        required: false,
        placeholder: "Nhập số điện thoại khẩn cấp",
      },
      {
        name: "notes",
        label: "Ghi chú",
        type: "textarea",
        required: false,
        placeholder: "Nhập ghi chú",
        gridColumn: "1 / -1",
      },
    ];
    return fields;
  }, [departments, positions]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values);
      }
    } else {
      onCreateEmployee(values);
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
