import BaseView from "@/components/base-view/BaseView";
import type { TaxBracketDto } from "@/dto/settings.dto";
import {
  useListTaxBrackets,
  useCreateTaxBracket,
  useUpdateTaxBracket,
  useDeleteTaxBracket,
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
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const { Title } = Typography;

export default function TaxBracketsPage() {
  const { data, isLoading, refetch } = useListTaxBrackets();
  const { onCreateTaxBracket, isLoading: isCreating } = useCreateTaxBracket();
  const { onUpdateTaxBracket, isLoading: isUpdating } = useUpdateTaxBracket();
  const { onDeleteTaxBracket, isLoading: isDeleting } = useDeleteTaxBracket();

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<TaxBracketDto | null>(null);
  const [form] = Form.useForm();

  const openCreate = () => {
    setEditRecord(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setModalOpen(true);
  };

  const openEdit = (record: TaxBracketDto) => {
    setEditRecord(record);
    form.setFieldsValue({
      policyName: record.policyName,
      minIncome: record.minIncome,
      maxIncome: record.maxIncome,
      taxRate: record.taxRate,
      subtractAmount: record.subtractAmount,
      isActive: record.isActive ?? true,
      effectiveDate: record.effectiveDate ? dayjs(record.effectiveDate) : null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: TaxBracketDto = {
      ...values,
      effectiveDate: values.effectiveDate
        ? dayjs(values.effectiveDate).format("YYYY-MM-DD")
        : undefined,
    };
    if (editRecord?.id) {
      await onUpdateTaxBracket({ id: editRecord.id, body: payload });
    } else {
      await onCreateTaxBracket(payload);
    }
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async (id: string) => {
    await onDeleteTaxBracket(id);
    refetch();
  };

  const fmtCurrency = (v: number | undefined | null) =>
    v !== undefined && v !== null
      ? new Intl.NumberFormat("vi-VN").format(v)
      : "-";

  const columns = [
    {
      title: "Tên chính sách",
      dataIndex: "policyName",
      key: "policyName",
    },
    {
      title: "Thu nhập tối thiểu (đ)",
      dataIndex: "minIncome",
      key: "minIncome",
      width: 180,
      render: fmtCurrency,
    },
    {
      title: "Thu nhập tối đa (đ)",
      dataIndex: "maxIncome",
      key: "maxIncome",
      width: 180,
      render: (v: number | null) => (v ? fmtCurrency(v) : "Không giới hạn"),
    },
    {
      title: "Thuế suất (%)",
      dataIndex: "taxRate",
      key: "taxRate",
      width: 120,
      render: (v: number) => (v !== undefined ? `${v}%` : "-"),
    },
    {
      title: "Số tiền giảm trừ (đ)",
      dataIndex: "subtractAmount",
      key: "subtractAmount",
      width: 180,
      render: fmtCurrency,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 110,
      render: (v: boolean) =>
        v ? (
          <Tag color="success">Đang dùng</Tag>
        ) : (
          <Tag color="default">Không dùng</Tag>
        ),
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
      render: (_: any, record: TaxBracketDto) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Xoá bậc thuế này?"
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
          Bậc thuế thu nhập cá nhân (TNCN)
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm bậc thuế
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
        title={editRecord ? "Chỉnh sửa bậc thuế" : "Thêm bậc thuế"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={isCreating || isUpdating}
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ paddingTop: 8 }}>
          <Form.Item
            name="policyName"
            label="Tên chính sách"
            rules={[{ required: true, message: "Bắt buộc nhập tên" }]}
          >
            <Input placeholder="vd: Bậc 1 (≤5 triệu)" />
          </Form.Item>

          <Form.Item
            name="minIncome"
            label="Thu nhập tối thiểu (đ/tháng)"
            rules={[{ required: true, message: "Bắt buộc nhập" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/,/g, "") as any}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="maxIncome"
            label="Thu nhập tối đa (đ/tháng) — để trống nếu không giới hạn"
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/,/g, "") as any}
              placeholder="Không giới hạn"
            />
          </Form.Item>

          <Form.Item
            name="taxRate"
            label="Thuế suất (%)"
            rules={[{ required: true, message: "Bắt buộc nhập thuế suất" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
              formatter={(v) => `${v}%`}
              parser={(v) => v?.replace("%", "") as any}
              placeholder="5"
            />
          </Form.Item>

          <Form.Item name="subtractAmount" label="Số tiền giảm trừ (đ)">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/,/g, "") as any}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Đang áp dụng"
            valuePropName="checked"
          >
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>

          <Form.Item name="effectiveDate" label="Ngày hiệu lực">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </BaseView>
  );
}
