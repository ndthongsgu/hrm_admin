import BaseView from "@/components/base-view/BaseView";
import TableCustom from "@/components/table/Table";
import type {
  AllowanceTypeDto,
  ContractAllowanceDto,
  ContractDto,
  SelectOptionDto,
} from "@/dto/contract.dto";
import {
  useAllowanceTypes,
  useContractAllowances,
  useContracts,
  useCreateAllowanceType,
  useCreateContract,
  useCreateContractAllowance,
  useDeleteAllowanceType,
  useDeleteContract,
  useDeleteContractAllowance,
  useEmployeeOptions,
  usePositionOptions,
  useUpdateAllowanceType,
  useUpdateContract,
  useUpdateContractAllowance,
} from "@/hooks/contract";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

const { Title } = Typography;

type TabKey = "contracts" | "allowanceTypes" | "contractAllowances";

const CONTRACT_STATUSES = [
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "EXPIRED", value: "EXPIRED" },
];

const currency = (value?: number) =>
  value !== undefined && value !== null
    ? new Intl.NumberFormat("vi-VN").format(value)
    : "-";

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "-";

export default function ContractManagerPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("contracts");
  const [contractPage, setContractPage] = useState({ current: 1, pageSize: 20 });
  const [allowanceTypePage, setAllowanceTypePage] = useState({
    current: 1,
    pageSize: 20,
  });
  const [contractAllowancePage, setContractAllowancePage] = useState({
    current: 1,
    pageSize: 20,
  });

  const {
    data: contracts,
    isLoading: loadingContracts,
    refetch: refetchContracts,
  } = useContracts();
  const {
    data: allowanceTypes,
    isLoading: loadingAllowanceTypes,
    refetch: refetchAllowanceTypes,
  } = useAllowanceTypes();
  const {
    data: contractAllowances,
    isLoading: loadingContractAllowances,
    refetch: refetchContractAllowances,
  } = useContractAllowances();

  const { data: employeeOptions, isLoading: loadingEmployees } =
    useEmployeeOptions();
  const { data: positionOptions, isLoading: loadingPositions } =
    usePositionOptions();

  const createContractMutation = useCreateContract();
  const updateContractMutation = useUpdateContract();
  const deleteContractMutation = useDeleteContract();

  const createAllowanceTypeMutation = useCreateAllowanceType();
  const updateAllowanceTypeMutation = useUpdateAllowanceType();
  const deleteAllowanceTypeMutation = useDeleteAllowanceType();

  const createContractAllowanceMutation = useCreateContractAllowance();
  const updateContractAllowanceMutation = useUpdateContractAllowance();
  const deleteContractAllowanceMutation = useDeleteContractAllowance();

  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [allowanceTypeModalOpen, setAllowanceTypeModalOpen] = useState(false);
  const [contractAllowanceModalOpen, setContractAllowanceModalOpen] =
    useState(false);

  const [editingContract, setEditingContract] = useState<ContractDto | null>(
    null,
  );
  const [editingAllowanceType, setEditingAllowanceType] =
    useState<AllowanceTypeDto | null>(null);
  const [editingContractAllowance, setEditingContractAllowance] =
    useState<ContractAllowanceDto | null>(null);

  const [contractForm] = Form.useForm();
  const [allowanceTypeForm] = Form.useForm();
  const [contractAllowanceForm] = Form.useForm();

  const contractSelectOptions = useMemo<SelectOptionDto[]>(
    () =>
      contracts.map((item) => ({
        id: item.id,
        name: `${item.contractNumber || "N/A"} - ${
          item.employee?.fullName || item.employee?.name || "N/A"
        }`,
      })),
    [contracts],
  );

  const openCreateContract = () => {
    setEditingContract(null);
    contractForm.resetFields();
    contractForm.setFieldsValue({ status: "ACTIVE", isNet: false });
    setContractModalOpen(true);
  };

  const openEditContract = (record: ContractDto) => {
    setEditingContract(record);
    contractForm.setFieldsValue({
      employeeId: record.employee?.id,
      contractNumber: record.contractNumber,
      baseSalary: record.baseSalary,
      actualSalary: record.actualSalary,
      positionId: record.position?.id,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
      status: record.status,
      isNet: Boolean(record.isNet),
    });
    setContractModalOpen(true);
  };

  const submitContract = async () => {
    const values = await contractForm.validateFields();
    const payload = {
      employee: { id: values.employeeId },
      contractNumber: values.contractNumber,
      baseSalary: values.baseSalary,
      actualSalary: values.actualSalary,
      position: values.positionId ? { id: values.positionId } : null,
      startDate: values.startDate
        ? dayjs(values.startDate).format("YYYY-MM-DD")
        : undefined,
      endDate: values.endDate
        ? dayjs(values.endDate).format("YYYY-MM-DD")
        : undefined,
      status: values.status,
      isNet: Boolean(values.isNet),
    };

    if (editingContract?.id) {
      await updateContractMutation.mutateAsync({
        id: editingContract.id,
        body: payload,
      });
    } else {
      await createContractMutation.mutateAsync(payload);
    }

    setContractModalOpen(false);
    refetchContracts();
  };

  const openCreateAllowanceType = () => {
    setEditingAllowanceType(null);
    allowanceTypeForm.resetFields();
    allowanceTypeForm.setFieldsValue({
      isTaxable: true,
      isInsuranceBased: true,
    });
    setAllowanceTypeModalOpen(true);
  };

  const openEditAllowanceType = (record: AllowanceTypeDto) => {
    setEditingAllowanceType(record);
    allowanceTypeForm.setFieldsValue({
      name: record.name,
      isTaxable: Boolean(record.isTaxable),
      isInsuranceBased: Boolean(record.isInsuranceBased),
    });
    setAllowanceTypeModalOpen(true);
  };

  const submitAllowanceType = async () => {
    const values = await allowanceTypeForm.validateFields();
    const payload = {
      name: values.name,
      isTaxable: Boolean(values.isTaxable),
      isInsuranceBased: Boolean(values.isInsuranceBased),
    };

    if (editingAllowanceType?.id) {
      await updateAllowanceTypeMutation.mutateAsync({
        id: editingAllowanceType.id,
        body: payload,
      });
    } else {
      await createAllowanceTypeMutation.mutateAsync(payload);
    }

    setAllowanceTypeModalOpen(false);
    refetchAllowanceTypes();
  };

  const openCreateContractAllowance = () => {
    setEditingContractAllowance(null);
    contractAllowanceForm.resetFields();
    setContractAllowanceModalOpen(true);
  };

  const openEditContractAllowance = (record: ContractAllowanceDto) => {
    setEditingContractAllowance(record);
    contractAllowanceForm.setFieldsValue({
      contractId: record.contract?.id,
      allowanceTypeId: record.allowanceType?.id,
      amount: record.amount,
    });
    setContractAllowanceModalOpen(true);
  };

  const submitContractAllowance = async () => {
    const values = await contractAllowanceForm.validateFields();
    const payload = {
      contract: { id: values.contractId },
      allowanceType: { id: values.allowanceTypeId },
      amount: values.amount,
    };

    if (editingContractAllowance?.id) {
      await updateContractAllowanceMutation.mutateAsync({
        id: editingContractAllowance.id,
        body: payload,
      });
    } else {
      await createContractAllowanceMutation.mutateAsync(payload);
    }

    setContractAllowanceModalOpen(false);
    refetchContractAllowances();
  };

  const contractColumns = [
    {
      title: "Số hợp đồng",
      dataIndex: "contractNumber",
      key: "contractNumber",
      width: 160,
    },
    {
      title: "Nhân viên",
      key: "employee",
      render: (_: any, record: ContractDto) =>
        record.employee?.fullName || record.employee?.name || "-",
    },
    {
      title: "Vị trí",
      key: "position",
      render: (_: any, record: ContractDto) => record.position?.name || "-",
    },
    {
      title: "Lương đóng BH",
      dataIndex: "baseSalary",
      key: "baseSalary",
      width: 150,
      render: (value: number) => currency(value),
    },
    {
      title: "Lương hợp đồng",
      dataIndex: "actualSalary",
      key: "actualSalary",
      width: 150,
      render: (value: number) => currency(value),
    },
    {
      title: "Kiểu lương",
      dataIndex: "isNet",
      key: "isNet",
      width: 110,
      render: (value: boolean) =>
        value ? <Tag color="blue">NET</Tag> : <Tag color="gold">GROSS</Tag>,
    },
    {
      title: "Hiệu lực",
      key: "duration",
      width: 220,
      render: (_: any, record: ContractDto) =>
        `${formatDate(record.startDate)} - ${formatDate(record.endDate)}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value: string) =>
        value === "ACTIVE" ? (
          <Tag color="green">ACTIVE</Tag>
        ) : (
          <Tag color="default">{value || "-"}</Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_: any, record: ContractDto) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditContract(record)}
          />
          <Popconfirm
            title="Xoá hợp đồng này?"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => deleteContractMutation.mutateAsync(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={deleteContractMutation.isPending}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const allowanceTypeColumns = [
    {
      title: "Tên phụ cấp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tính thuế",
      dataIndex: "isTaxable",
      key: "isTaxable",
      width: 120,
      render: (value: boolean) =>
        value ? <Tag color="green">Có</Tag> : <Tag color="default">Không</Tag>,
    },
    {
      title: "Tính bảo hiểm",
      dataIndex: "isInsuranceBased",
      key: "isInsuranceBased",
      width: 140,
      render: (value: boolean) =>
        value ? <Tag color="green">Có</Tag> : <Tag color="default">Không</Tag>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_: any, record: AllowanceTypeDto) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditAllowanceType(record)}
          />
          <Popconfirm
            title="Xoá loại phụ cấp này?"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => deleteAllowanceTypeMutation.mutateAsync(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={deleteAllowanceTypeMutation.isPending}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const contractAllowanceColumns = [
    {
      title: "Hợp đồng",
      key: "contract",
      render: (_: any, record: ContractAllowanceDto) =>
        record.contract?.contractNumber || "-",
    },
    {
      title: "Nhân viên",
      key: "employee",
      render: (_: any, record: ContractAllowanceDto) =>
        record.contract?.employee?.fullName ||
        record.contract?.employee?.name ||
        "-",
    },
    {
      title: "Loại phụ cấp",
      key: "allowanceType",
      render: (_: any, record: ContractAllowanceDto) =>
        record.allowanceType?.name || "-",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      width: 140,
      render: (value: number) => currency(value),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_: any, record: ContractAllowanceDto) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditContractAllowance(record)}
          />
          <Popconfirm
            title="Xoá phụ cấp hợp đồng này?"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() =>
              deleteContractAllowanceMutation.mutateAsync(record.id)
            }
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={deleteContractAllowanceMutation.isPending}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pagedContracts = useMemo(() => {
    const start = (contractPage.current - 1) * contractPage.pageSize;
    return contracts.slice(start, start + contractPage.pageSize);
  }, [contracts, contractPage.current, contractPage.pageSize]);

  const pagedAllowanceTypes = useMemo(() => {
    const start = (allowanceTypePage.current - 1) * allowanceTypePage.pageSize;
    return allowanceTypes.slice(start, start + allowanceTypePage.pageSize);
  }, [allowanceTypes, allowanceTypePage.current, allowanceTypePage.pageSize]);

  const pagedContractAllowances = useMemo(() => {
    const start =
      (contractAllowancePage.current - 1) * contractAllowancePage.pageSize;
    return contractAllowances.slice(start, start + contractAllowancePage.pageSize);
  }, [
    contractAllowances,
    contractAllowancePage.current,
    contractAllowancePage.pageSize,
  ]);

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
          Quản lý hợp đồng lao động
        </Title>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
        items={[
          {
            key: "contracts",
            label: "Hợp đồng",
            children: (
              <>
                <div style={{ marginBottom: 12, textAlign: "right" }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openCreateContract}
                  >
                    Thêm hợp đồng
                  </Button>
                </div>
                <TableCustom<ContractDto>
                  columns={contractColumns}
                  data={pagedContracts}
                  loading={loadingContracts}
                  pagination={{
                    total: contracts.length,
                    pageSize: contractPage.pageSize,
                    current: contractPage.current,
                    showSizeChanger: false,
                  }}
                  onPageChange={(page, pageSize) =>
                    setContractPage({ current: page, pageSize })
                  }
                />
              </>
            ),
          },
          {
            key: "allowanceTypes",
            label: "Loại phụ cấp",
            children: (
              <>
                <div style={{ marginBottom: 12, textAlign: "right" }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openCreateAllowanceType}
                  >
                    Thêm loại phụ cấp
                  </Button>
                </div>
                <TableCustom<AllowanceTypeDto>
                  columns={allowanceTypeColumns}
                  data={pagedAllowanceTypes}
                  loading={loadingAllowanceTypes}
                  pagination={{
                    total: allowanceTypes.length,
                    pageSize: allowanceTypePage.pageSize,
                    current: allowanceTypePage.current,
                    showSizeChanger: false,
                  }}
                  onPageChange={(page, pageSize) =>
                    setAllowanceTypePage({ current: page, pageSize })
                  }
                />
              </>
            ),
          },
          {
            key: "contractAllowances",
            label: "Phụ cấp theo hợp đồng",
            children: (
              <>
                <div style={{ marginBottom: 12, textAlign: "right" }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openCreateContractAllowance}
                  >
                    Thêm phụ cấp hợp đồng
                  </Button>
                </div>
                <TableCustom<ContractAllowanceDto>
                  columns={contractAllowanceColumns}
                  data={pagedContractAllowances}
                  loading={loadingContractAllowances}
                  pagination={{
                    total: contractAllowances.length,
                    pageSize: contractAllowancePage.pageSize,
                    current: contractAllowancePage.current,
                    showSizeChanger: false,
                  }}
                  onPageChange={(page, pageSize) =>
                    setContractAllowancePage({ current: page, pageSize })
                  }
                />
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingContract ? "Cập nhật hợp đồng" : "Thêm hợp đồng"}
        open={contractModalOpen}
        onCancel={() => setContractModalOpen(false)}
        onOk={submitContract}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={
          createContractMutation.isPending || updateContractMutation.isPending
        }
        width={760}
        destroyOnClose
      >
        <Form form={contractForm} layout="vertical" style={{ paddingTop: 8 }}>
          <Form.Item
            name="employeeId"
            label="Nhân viên"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
          >
            <Select
              showSearch
              loading={loadingEmployees}
              optionFilterProp="label"
              options={employeeOptions.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder="Chọn nhân viên"
            />
          </Form.Item>

          <Form.Item
            name="contractNumber"
            label="Số hợp đồng"
            rules={[{ required: true, message: "Vui lòng nhập số hợp đồng" }]}
          >
            <Input placeholder="VD: HD-2026-0001" />
          </Form.Item>

          <Form.Item
            name="positionId"
            label="Vị trí"
            rules={[{ required: true, message: "Vui lòng chọn vị trí" }]}
          >
            <Select
              showSearch
              loading={loadingPositions}
              optionFilterProp="label"
              options={positionOptions.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder="Chọn vị trí"
            />
          </Form.Item>

          <Space size={16} style={{ width: "100%" }}>
            <Form.Item
              name="baseSalary"
              label="Lương đóng BH"
              rules={[
                { required: true, message: "Vui lòng nhập lương đóng BH" },
              ]}
              style={{ width: 220 }}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => Number((v || "0").replace(/,/g, "")) as any}
              />
            </Form.Item>

            <Form.Item
              name="actualSalary"
              label="Lương hợp đồng"
              rules={[
                { required: true, message: "Vui lòng nhập lương hợp đồng" },
              ]}
              style={{ width: 220 }}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => Number((v || "0").replace(/,/g, "")) as any}
              />
            </Form.Item>

            <Form.Item name="isNet" label="Net salary" valuePropName="checked">
              <Switch checkedChildren="NET" unCheckedChildren="GROSS" />
            </Form.Item>
          </Space>

          <Space size={16} style={{ width: "100%" }}>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              ]}
              style={{ width: 220 }}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              style={{ width: 220 }}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              style={{ width: 180 }}
            >
              <Select options={CONTRACT_STATUSES} placeholder="Trạng thái" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>

      <Modal
        title={
          editingAllowanceType ? "Cập nhật loại phụ cấp" : "Thêm loại phụ cấp"
        }
        open={allowanceTypeModalOpen}
        onCancel={() => setAllowanceTypeModalOpen(false)}
        onOk={submitAllowanceType}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={
          createAllowanceTypeMutation.isPending ||
          updateAllowanceTypeMutation.isPending
        }
        width={520}
        destroyOnClose
      >
        <Form
          form={allowanceTypeForm}
          layout="vertical"
          style={{ paddingTop: 8 }}
        >
          <Form.Item
            name="name"
            label="Tên loại phụ cấp"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="VD: Phụ cấp trách nhiệm" />
          </Form.Item>

          <Form.Item name="isTaxable" label="Tính thuế" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>

          <Form.Item
            name="isInsuranceBased"
            label="Tính bảo hiểm"
            valuePropName="checked"
          >
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          editingContractAllowance
            ? "Cập nhật phụ cấp theo hợp đồng"
            : "Thêm phụ cấp theo hợp đồng"
        }
        open={contractAllowanceModalOpen}
        onCancel={() => setContractAllowanceModalOpen(false)}
        onOk={submitContractAllowance}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={
          createContractAllowanceMutation.isPending ||
          updateContractAllowanceMutation.isPending
        }
        width={560}
        destroyOnClose
      >
        <Form
          form={contractAllowanceForm}
          layout="vertical"
          style={{ paddingTop: 8 }}
        >
          <Form.Item
            name="contractId"
            label="Hợp đồng"
            rules={[{ required: true, message: "Vui lòng chọn hợp đồng" }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              options={contractSelectOptions.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder="Chọn hợp đồng"
            />
          </Form.Item>

          <Form.Item
            name="allowanceTypeId"
            label="Loại phụ cấp"
            rules={[{ required: true, message: "Vui lòng chọn loại phụ cấp" }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              options={allowanceTypes.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder="Chọn loại phụ cấp"
            />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Số tiền"
            rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => Number((v || "0").replace(/,/g, "")) as any}
            />
          </Form.Item>
        </Form>
      </Modal>
    </BaseView>
  );
}
