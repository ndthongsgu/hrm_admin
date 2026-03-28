import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import type { InsuranceConfigDto } from "@/dto/settings.dto";
import {
  useListInsuranceConfigs,
  useCreateInsuranceConfig,
  useUpdateInsuranceConfig,
  useDeleteInsuranceConfig,
} from "@/hooks/settings";
import { useConfirm } from "@/hooks/layout/useConfirm";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Select,
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

const initFilter = {
  type: undefined,
  capBaseType: undefined,
};

export default function InsuranceConfigsPage() {
  const [filter, setFilter] = useState<Record<string, any>>(initFilter);
  const [pagination, setPagination] = useState({
    skip: 0,
    take: 20,
    where: initFilter,
  });
  const { data, total, isLoading, refetch, error } = useListInsuranceConfigs({
    skip: pagination.skip,
    take: pagination.take,
    where: pagination.where,
  });
  const { onCreateInsuranceConfig, isLoading: isCreating } =
    useCreateInsuranceConfig();
  const { onUpdateInsuranceConfig, isLoading: isUpdating } =
    useUpdateInsuranceConfig();
  const { onDeleteInsuranceConfig, isLoading: isDeleting } =
    useDeleteInsuranceConfig();
  const { confirm } = useConfirm();

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

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "type",
      label: "Loại bảo hiểm",
      type: "select",
      options: [
        { label: "Tất cả", value: undefined },
        ...Object.entries(INSURANCE_TYPE_MAP).map(([value, meta]) => ({
          label: meta.label,
          value,
        })),
      ],
      col: 12,
    },
    {
      key: "capBaseType",
      label: "Căn cơ trần",
      type: "select",
      options: [{ label: "Tất cả", value: undefined }, ...CAP_BASE_OPTIONS],
      col: 12,
    },
  ];

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
  ];

  const actions: TableAction[] = [
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      type: "default",
      tooltip: "Cập nhật",
      onClick: (record: InsuranceConfigDto) => openEdit(record),
    },
    {
      key: "delete",
      label: "",
      icon: <DeleteOutlined />,
      type: "default",
      danger: true,
      tooltip: "Xóa",
      disabled: () => isDeleting,
      onClick: (record: InsuranceConfigDto) => {
        confirm({
          title: "Xác nhận xóa cấu hình bảo hiểm",
          content: "Bạn có chắc chắn muốn xóa cấu hình bảo hiểm này?",
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
          Cấu hình bảo hiểm
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm cấu hình
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
          message="Không thể tải dữ liệu cấu hình bảo hiểm"
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
