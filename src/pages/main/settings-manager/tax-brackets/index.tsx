import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { TaxBracketDto } from "@/dto/settings.dto";
import {
  useListTaxBrackets,
  useCreateTaxBracket,
  useUpdateTaxBracket,
  useDeleteTaxBracket,
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
  Switch,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const { Title } = Typography;

const initFilter = {
  policyName: "",
  isActive: undefined,
};

export default function TaxBracketsPage() {
  const [filter, setFilter] = useState<Record<string, any>>(initFilter);
  const [pagination, setPagination] = useState({
    skip: 0,
    take: 20,
    where: initFilter,
  });
  const { data, total, isLoading, refetch, error } = useListTaxBrackets({
    skip: pagination.skip,
    take: pagination.take,
    where: pagination.where,
  });
  const { onCreateTaxBracket, isLoading: isCreating } = useCreateTaxBracket();
  const { onUpdateTaxBracket, isLoading: isUpdating } = useUpdateTaxBracket();
  const { onDeleteTaxBracket, isLoading: isDeleting } = useDeleteTaxBracket();
  const { confirm } = useConfirm();

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

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "policyName",
      label: "Tên chính sách",
      type: "input",
      placeholder: "Nhập tên chính sách",
      col: 12,
    },
    {
      key: "isActive",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Đang dùng", value: true },
        { label: "Không dùng", value: false },
      ],
      col: 12,
    },
  ];

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
  ];

  const actions: TableAction[] = [
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      type: "default",
      tooltip: "Cập nhật",
      onClick: (record: TaxBracketDto) => openEdit(record),
    },
    {
      key: "delete",
      label: "",
      icon: <DeleteOutlined />,
      type: "default",
      danger: true,
      tooltip: "Xóa",
      disabled: () => isDeleting,
      onClick: (record: TaxBracketDto) => {
        confirm({
          title: "Xác nhận xóa bậc thuế",
          content: `Bạn có chắc chắn muốn xóa ${record.policyName || "bậc thuế này"}?`,
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
          Bậc thuế thu nhập cá nhân (TNCN)
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm bậc thuế
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
          message="Không thể tải dữ liệu bậc thuế"
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
