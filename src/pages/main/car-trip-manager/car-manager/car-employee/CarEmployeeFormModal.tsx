import type {
  CarEmployeeCreateUpdateDto,
  CarEmployeeDto,
} from "@/dto/carEmployee.dto";
import { useGetAllCars } from "@/hooks/car";
import {
  useCreateCarEmployee,
  useUpdateCarEmployee,
} from "@/hooks/car-employee";
import { useAllEmployees } from "@/hooks/employee";
import { Form, Modal, Select } from "antd";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing?: CarEmployeeDto | null;
}

export default function CarEmployeeFormModal({
  open,
  onClose,
  onSaved,
  editing,
}: Props) {
  const [form] = Form.useForm();
  const { data: cars } = useGetAllCars();
  const { data: employees } = useAllEmployees();
  const { onCreateCarEmployee, isLoading: creating } = useCreateCarEmployee();
  const { onUpdateCarEmployee, isLoading: updating } = useUpdateCarEmployee(
    editing?.id || ""
  );

  useEffect(() => {
    if (open && editing) {
      form.setFieldsValue({
        carId: editing.car?.id,
        employeeId: editing.employee?.id,
        role: editing.role,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, editing, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const body: CarEmployeeCreateUpdateDto = {
      carId: values.carId,
      employeeId: values.employeeId,
      role: values.role,
    };
    if (editing) {
      await onUpdateCarEmployee(body);
    } else {
      await onCreateCarEmployee(body);
    }
    onSaved();
    onClose();
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={creating || updating}
      title={editing ? "Chỉnh sửa phân công" : "Thêm phân công"}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="carId" label="Xe" rules={[{ required: true }]}>
          <Select
            options={cars.map((c: any) => ({
              label: c.licensePlate,
              value: c.id,
            }))}
            placeholder="Chọn xe"
          />
        </Form.Item>
        <Form.Item
          name="employeeId"
          label="Nhân viên"
          rules={[{ required: true }]}
        >
          <Select
            options={employees.map((e: any) => ({
              label: e.name,
              value: e.id,
            }))}
            placeholder="Chọn nhân viên"
          />
        </Form.Item>
        <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Tài xế", value: "DRIVER" },
              { label: "Phụ xe", value: "ASSISTANT" },
              { label: "Tạp vụ", value: "CLEANER" },
            ]}
            placeholder="Chọn vai trò"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
