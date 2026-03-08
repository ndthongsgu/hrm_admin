import BaseView from "@/components/base-view/BaseView";
import type { InsuranceConfigDto } from "@/dto/settings.dto";
import {
  useListInsuranceConfigs,
  useCreateInsuranceConfig,
  useUpdateInsuranceConfig,
  useDeleteInsuranceConfig,
} from "@/hooks/settings";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const { Title } = Typography;

const INSURANCE_TYPE_MAP: Record<string, { label: string; color: string }> = {
  SOCIAL: { label: "Bảo hiểm xã hội", color: "blue" },
  HEALTH: { label: "Bảo hiểm y tế", color: "green" },
  UNEMPLOYMENT: { label: "Bảo hiểm thất nghiệp", color: "orange" },
};

const CAP_BASE_OPTIONS = [
  { value: "BASE_SALARY", label: "Lương cơ sở nhà nước" },
  { value: "REGION_MIN", label: "Lương tối thiểu vùng" },
  { value: "ACTUAL_SALARY", label: "Lương thực tế" },
];

export default function InsuranceConfigsPage() {
  const { data, isLoading, refetch } = useListInsuranceConfigs();
  const { onCreateInsuranceConfig, isLoading: isCreating } =
    useCreateInsuranceConfig();
  const { onUpdateInsuranceConfig, isLoading: isUpdating } =
    useUpdateInsuranceConfig();
  const { onDeleteInsuranceConfig, isLoading: isDeleting } =
    useDeleteInsuranceConfig();

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<InsuranceConfigDto | null>(null);
  const [form] = Form.useForm();

  const openCreate = () => {
    setEditRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: InsuranceConfigDto) => {
    setEditRecord(record);
    form.setFieldsValue({
      type: record.type,
      employeeRate: record.employeeRate,
      companyRate: record.companyRate,
      capBaseType: record.capBaseType,
      capMultiplier: record.capMultiplier,
      effectiveDate: record.effectiveDate ? dayjs(record.effectiveDate) : null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: InsuranceConfigDto = {
      ...values,
      effectiveDate: values.effectiveDate
        ? dayjs(values.effectiveDate).format("YYYY-MM-DD")
        : undefined,
    };
    if (editRecord?.id) {
      await onUpdateInsuranceConfig({ id: editRecord.id, body: payload });
    } else {
      await onCreateInsuranceConfig(payload);
    }
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async (id: string) => {
    await onDeleteInsuranceConfig(id);
    refetch();
  };

  const columns = [
    {
      title: "Loại bảo hiểm",
      dataIndex: "type",
      key: "type",
      width: 200,
      render: (t: string) => {
        const meta = INSURANCE_TYPE_MAP[t];
        return meta ? (
          <Tag color={meta.color}>{meta.label}</Tag>
        ) : (
          <Tag>{t}</Tag>
        );
      },
    },
    {
      title: "Tỷ lệ NLĐ (%)",
      dataIndex: "employeeRate",
      key: "employeeRate",
      width: 140,
      render: (v: number) => (v !== undefined ? `${v}%` : "-"),
    },
    {
      title: "Tỷ lệ NSDLĐ (%)",
      dataIndex: "companyRate",
      key: "companyRate",
      width: 150,
      render: (v: number) => (v !== undefined ? `${v}%` : "-"),
    },
    {
      title: "Căn cơ trần",
      dataIndex: "capBaseType",
      key: "capBaseType",
      width: 180,
      render: (v: string) =>
        CAP_BASE_OPTIONS.find((o) => o.value === v)?.label ?? v ?? "-",
    },
    {
      title: "Hệ số trần",
      dataIndex: "capMultiplier",
      key: "capMultiplier",
      width: 110,
      render: (v: number) => (v !== undefined && v !== null ? `×${v}` : "-"),
    },
    {
      title: "Ngày hiệu lực",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      width: 140,
      render: (d: string) =>
        d ? new Date(d).toLocaleDateString("vi-VN") : "-",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_: any, record: InsuranceConfigDto) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Xoá cấu hình bảo hiểm này?"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(record.id!)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={isDeleting}
            />
          </Popconfirm>
        </Space>
      ),
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
          Cấu hình bảo hiểm
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm cấu hình
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={{ pageSize: 20, showSizeChanger: false }}
        size="middle"
        bordered
      />

      <Modal
        title={
          editRecord ? "Chỉnh sửa cấu hình bảo hiểm" : "Thêm cấu hình bảo hiểm"
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={isCreating || isUpdating}
        width={540}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ paddingTop: 8 }}>
          <Form.Item
            name="type"
            label="Loại bảo hiểm"
            rules={[{ required: true, message: "Bắt buộc chọn loại" }]}
          >
            <Select
              disabled={!!editRecord}
              placeholder="Chọn loại bảo hiểm"
              options={Object.entries(INSURANCE_TYPE_MAP).map(
                ([value, { label }]) => ({ value, label }),
              )}
            />
          </Form.Item>

          <Form.Item
            name="employeeRate"
            label="Tỷ lệ đóng của người lao động (%)"
            rules={[{ required: true, message: "Bắt buộc nhập" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
              step={0.5}
              formatter={(v) => `${v}%`}
              parser={(v) => v?.replace("%", "") as any}
            />
          </Form.Item>

          <Form.Item
            name="companyRate"
            label="Tỷ lệ đóng của người sử dụng lao động (%)"
            rules={[{ required: true, message: "Bắt buộc nhập" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
              step={0.5}
              formatter={(v) => `${v}%`}
              parser={(v) => v?.replace("%", "") as any}
            />
          </Form.Item>

          <Form.Item name="capBaseType" label="Căn cơ tính trần đóng bảo hiểm">
            <Select
              placeholder="Chọn loại căn cơ"
              allowClear
              options={CAP_BASE_OPTIONS}
            />
          </Form.Item>

          <Form.Item name="capMultiplier" label="Hệ số trần (× mức căn cơ)">
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              step={1}
              placeholder="vd: 20"
            />
          </Form.Item>

          <Form.Item name="effectiveDate" label="Ngày hiệu lực">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </BaseView>
  );
}
