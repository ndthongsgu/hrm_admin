import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { SysSettingDto } from "@/dto/settings.dto";
import {
  useListSysSettings,
  useCreateSysSetting,
  useUpdateSysSetting,
  useDeleteSysSetting,
} from "@/hooks/settings";
import { useConfirm } from "@/hooks/layout/useConfirm";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const { Title } = Typography;

const SYS_SETTING_LABELS: Record<string, string> = {
  pit_deduction_personal: "Giảm trừ bản thân (PIT)",
  pit_deduction_dependent: "Giảm trừ người phụ thuộc (PIT)",
  insurance_cap_social: "Trần đóng BHXH",
  insurance_cap_health: "Trần đóng BHYT",
  insurance_cap_unemployment: "Trần đóng BHTN",
};

const initFilter = {
  key: "",
  description: "",
};

export default function SysSettingsPage() {
  const [filter, setFilter] = useState<Record<string, any>>(initFilter);
  const [pagination, setPagination] = useState({
    skip: 0,
    take: 20,
    where: initFilter,
  });
  const { data, total, isLoading, refetch, error } = useListSysSettings({
    skip: pagination.skip,
    take: pagination.take,
    where: pagination.where,
  });
  const { onCreateSysSetting, isLoading: isCreating } = useCreateSysSetting();
  const { onUpdateSysSetting, isLoading: isUpdating } = useUpdateSysSetting();
  const { onDeleteSysSetting, isLoading: isDeleting } = useDeleteSysSetting();
  const { confirm } = useConfirm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<SysSettingDto | null>(null);
  const [form] = Form.useForm();

  const openCreate = () => {
    setEditRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: SysSettingDto) => {
    setEditRecord(record);
    form.setFieldsValue({
      key: record.key,
      value: record.value,
      description: record.description,
      effectiveDate: record.effectiveDate ? dayjs(record.effectiveDate) : null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: SysSettingDto = {
      ...values,
      effectiveDate: values.effectiveDate
        ? dayjs(values.effectiveDate).format("YYYY-MM-DD")
        : undefined,
    };
    if (editRecord?.id) {
      await onUpdateSysSetting({ id: editRecord.id, body: payload });
    } else {
      await onCreateSysSetting(payload);
    }
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async (id: string) => {
    await onDeleteSysSetting(id);
    refetch();
  };

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "key",
      label: "Khoá cài đặt",
      type: "input",
      placeholder: "Nhập khoá",
      col: 12,
    },
    {
      key: "description",
      label: "Mô tả",
      type: "input",
      placeholder: "Nhập mô tả",
      col: 12,
    },
  ];

  const columns = [
    {
      title: "Khoá cài đặt",
      dataIndex: "key",
      key: "key",
      width: 260,
      render: (k: string) => (
        <span>
          <Tag color="blue" style={{ marginRight: 6 }}>
            {k}
          </Tag>
          {SYS_SETTING_LABELS[k] && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {SYS_SETTING_LABELS[k]}
            </Typography.Text>
          )}
        </span>
      ),
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      width: 160,
      render: (v: number) =>
        v !== undefined && v !== null
          ? new Intl.NumberFormat("vi-VN").format(v)
          : "-",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (v: string) => v || "-",
    },
    {
      title: "Ngày hiệu lực",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      width: 140,
      render: (d: string) =>
        d ? new Date(d).toLocaleDateString("vi-VN") : "-",
    },
  ];

  const actions: TableAction[] = [
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      type: "default",
      tooltip: "Cập nhật",
      onClick: (record: SysSettingDto) => openEdit(record),
    },
    {
      key: "delete",
      label: "",
      icon: <DeleteOutlined />,
      type: "default",
      danger: true,
      tooltip: "Xóa",
      disabled: () => isDeleting,
      onClick: (record: SysSettingDto) => {
        confirm({
          title: "Xác nhận xóa cài đặt",
          content: `Bạn có chắc chắn muốn xóa cài đặt ${record.key || ""}?`,
          onOk: () => handleDelete(record.id!),
        });
      },
    },
  ];

  return (
    <BaseView>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Cài đặt chung hệ thống
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm cài đặt
        </Button>
      </div>

      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={setFilter}
        onSearch={() => handleSearch(false)}
        onClear={() => {
          setFilter(initFilter);
          handleSearch(true);
        }}
      />

      {error && (
        <Alert
          type="error"
          showIcon
          message="Không thể tải dữ liệu cài đặt"
          description={(error as any)?.message || "Đã có lỗi xảy ra"}
          style={{ marginBottom: 12 }}
        />
      )}

      <TableCustom
        rowKey="id"
        columns={columns}
        actions={actions}
        data={data}
        loading={isLoading}
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total,
          showSizeChanger: true,
        }}
        onPageChange={(page, pageSize) => {
          setPagination({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: pagination.where,
          });
        }}
        size="middle"
        bordered
      />

      <Modal
        title={editRecord ? "Chỉnh sửa cài đặt" : "Thêm cài đặt"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={isCreating || isUpdating}
        width={520}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ paddingTop: 8 }}>
          <Form.Item
            name="key"
            label="Khoá (key)"
            rules={[{ required: true, message: "Bắt buộc nhập khoá" }]}
          >
            <Input
              disabled={!!editRecord}
              placeholder="vd: pit_deduction_personal"
            />
          </Form.Item>
          <Form.Item
            name="value"
            label="Giá trị"
            rules={[{ required: true, message: "Bắt buộc nhập giá trị" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/,/g, "") as any}
              placeholder="vd: 11000000"
            />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Mô tả ý nghĩa cài đặt" />
          </Form.Item>
          <Form.Item name="effectiveDate" label="Ngày hiệu lực">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </BaseView>
  );
}
