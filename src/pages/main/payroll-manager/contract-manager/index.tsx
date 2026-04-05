import BaseView from "@/components/base-view/BaseView";
import FilterComponent, {
  type FilterField,
} from "@/components/filter/FilterCustom";
import TableCustom, { type TableAction } from "@/components/table/Table";
import { ROUTES } from "@/common/constants/routes";
import type { PaginationDto } from "@/dto/base.dto";
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
import { useConfirm } from "@/hooks/layout/useConfirm";
import { useRouter } from "@/routes/hooks";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

type TabKey = "contracts" | "allowanceTypes" | "contractAllowances";

const initContractFilter = {
  keyword: "",
  contractNumber: "",
  employeeId: undefined,
  status: undefined,
};

const initAllowanceTypeFilter = {
  name: "",
  isTaxable: undefined,
  isInsuranceBased: undefined,
};

const initContractAllowanceFilter = {
  contractId: undefined,
  allowanceTypeId: undefined,
};

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("contracts");
  const [contractFilter, setContractFilter] =
    useState<Record<string, any>>(initContractFilter);
  const [allowanceTypeFilter, setAllowanceTypeFilter] = useState<
    Record<string, any>
  >(initAllowanceTypeFilter);
  const [contractAllowanceFilter, setContractAllowanceFilter] = useState<
    Record<string, any>
  >(initContractAllowanceFilter);
  const [contractPagination, setContractPagination] = useState<
    PaginationDto<Record<string, any>>
  >({
    skip: 0,
    take: 20,
    where: initContractFilter,
  });
  const [allowanceTypePagination, setAllowanceTypePagination] = useState<
    PaginationDto<Record<string, any>>
  >({
    skip: 0,
    take: 20,
    where: initAllowanceTypeFilter,
  });
  const [contractAllowancePagination, setContractAllowancePagination] =
    useState<PaginationDto<Record<string, any>>>({
      skip: 0,
      take: 20,
      where: initContractAllowanceFilter,
    });

  const {
    data: contracts,
    total: totalContracts,
    isLoading: loadingContracts,
    refetch: refetchContracts,
  } = useContracts(contractPagination);
  const {
    data: allowanceTypes,
    total: totalAllowanceTypes,
    isLoading: loadingAllowanceTypes,
    refetch: refetchAllowanceTypes,
  } = useAllowanceTypes(allowanceTypePagination);
  const {
    data: contractAllowances,
    total: totalContractAllowances,
    isLoading: loadingContractAllowances,
    refetch: refetchContractAllowances,
  } = useContractAllowances(contractAllowancePagination);

  const { data: employeeOptions, isLoading: loadingEmployees } =
    useEmployeeOptions();
  const { data: positionOptions, isLoading: loadingPositions } =
    usePositionOptions();
  const { confirm } = useConfirm();

  const resolveEmployeeName = (record: any) => {
    const employee = record?.employee;

    return (
      employee?.fullName ||
      employee?.name ||
      employee?.employeeCode ||
      employee?.code ||
      "-"
    );
  };

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

  const [editingContract] = useState<ContractDto | null>(null);
  const [editingAllowanceType] = useState<AllowanceTypeDto | null>(null);
  const [editingContractAllowance] = useState<ContractAllowanceDto | null>(
    null,
  );

  const [contractForm] = Form.useForm();
  const [allowanceTypeForm] = Form.useForm();
  const [contractAllowanceForm] = Form.useForm();

  const contractSelectOptions = useMemo<SelectOptionDto[]>(
    () =>
      contracts.map((item) => ({
        id: item.id,
        name: `${item.contractNumber || "N/A"} - ${resolveEmployeeName(item)}`,
      })),
    [contracts],
  );

  const allowanceTypeSelectOptions = useMemo<SelectOptionDto[]>(
    () =>
      allowanceTypes.map((item) => ({
        id: item.id,
        name: item.name || "N/A",
      })),
    [allowanceTypes],
  );

  const handleSearchContracts = (isReset?: boolean) => {
    setContractPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset
        ? initContractFilter
        : { ...prev.where, ...contractFilter },
    }));
  };

  const handleSearchAllowanceTypes = (isReset?: boolean) => {
    setAllowanceTypePagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset
        ? initAllowanceTypeFilter
        : { ...prev.where, ...allowanceTypeFilter },
    }));
  };

  const handleSearchContractAllowances = (isReset?: boolean) => {
    setContractAllowancePagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset
        ? initContractAllowanceFilter
        : { ...prev.where, ...contractAllowanceFilter },
    }));
  };

  const contractFilterFields: FilterField[] = [
    {
      key: "keyword",
      label: "Từ khóa",
      type: "input",
      placeholder: "Số hợp đồng / nhân viên / vị trí",
      col: 8,
    },
    {
      key: "contractNumber",
      label: "Số hợp đồng",
      type: "input",
      placeholder: "Nhập số hợp đồng",
      col: 8,
    },
    {
      key: "employeeId",
      label: "Nhân viên",
      type: "select",
      placeholder: "Chọn nhân viên",
      options:
        employeeOptions?.map((item) => ({
          label: item.name,
          value: item.id,
        })) || [],
      col: 8,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [{ label: "Tất cả", value: undefined }, ...CONTRACT_STATUSES],
      col: 8,
    },
  ];

  const allowanceTypeFilterFields: FilterField[] = [
    {
      key: "name",
      label: "Tên loại phụ cấp",
      type: "input",
      placeholder: "Nhập tên loại phụ cấp",
      col: 8,
    },
    {
      key: "isTaxable",
      label: "Tính thuế",
      type: "select",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
      col: 8,
    },
    {
      key: "isInsuranceBased",
      label: "Tính bảo hiểm",
      type: "select",
      options: [
        { label: "Tất cả", value: undefined },
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
      col: 8,
    },
  ];

  const contractAllowanceFilterFields: FilterField[] = [
    {
      key: "contractId",
      label: "Hợp đồng",
      type: "select",
      placeholder: "Chọn hợp đồng",
      options:
        contractSelectOptions?.map((item) => ({
          label: item.name,
          value: item.id,
        })) || [],
      col: 12,
    },
    {
      key: "allowanceTypeId",
      label: "Loại phụ cấp",
      type: "select",
      placeholder: "Chọn loại phụ cấp",
      options:
        allowanceTypeSelectOptions?.map((item) => ({
          label: item.name,
          value: item.id,
        })) || [],
      col: 12,
    },
  ];

  const openCreateContract = () => {
    router.push(
      ROUTES.MAIN.PAYROLL_MANAGER.children.CONTRACTS.children.ADD_CONTRACT.path,
    );
  };

  const openEditContract = (record: ContractDto) => {
    router.push(
      ROUTES.MAIN.PAYROLL_MANAGER.children.CONTRACTS.children.EDIT_CONTRACT.path.replace(
        ":id",
        record.id,
      ),
    );
  };

  const submitContract = async () => {
    const values = await contractForm.validateFields();
    const payload = {
      employeeId: values.employeeId,
      contractNumber: values.contractNumber,
      baseSalary: values.baseSalary,
      actualSalary: values.actualSalary,
      positionId: values.positionId || null,
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
    router.push(
      ROUTES.MAIN.PAYROLL_MANAGER.children.CONTRACTS.children.ADD_ALLOWANCE_TYPE
        .path,
    );
  };

  const openEditAllowanceType = (record: AllowanceTypeDto) => {
    router.push(
      ROUTES.MAIN.PAYROLL_MANAGER.children.CONTRACTS.children.EDIT_ALLOWANCE_TYPE.path.replace(
        ":id",
        record.id,
      ),
    );
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
    router.push(
      ROUTES.MAIN.PAYROLL_MANAGER.children.CONTRACTS.children
        .ADD_CONTRACT_ALLOWANCE.path,
    );
  };

  const openEditContractAllowance = (record: ContractAllowanceDto) => {
    router.push(
      ROUTES.MAIN.PAYROLL_MANAGER.children.CONTRACTS.children.EDIT_CONTRACT_ALLOWANCE.path.replace(
        ":id",
        record.id,
      ),
    );
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
      render: (_: any, record: ContractDto) => resolveEmployeeName(record),
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
        value ? <Tag color="green">NET</Tag> : <Tag color="red">GROSS</Tag>,
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
          <Tag color="red">{value || "-"}</Tag>
        ),
    },
  ];

  const contractActions: TableAction[] = [
    {
      key: "view",
      label: "",
      icon: <EyeOutlined />,
      type: "default",
      tooltip: "Chi tiết",
      onClick: (record: ContractDto) =>
        router.push(
          ROUTES.MAIN.PAYROLL_MANAGER.children.CONTRACTS.children.DETAIL_CONTRACT.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      type: "default",
      tooltip: "Cập nhật",
      onClick: (record: ContractDto) => openEditContract(record),
    },
    {
      key: "delete",
      label: "",
      icon: <DeleteOutlined />,
      type: "default",
      danger: true,
      tooltip: "Xóa",
      disabled: () => deleteContractMutation.isPending,
      onClick: (record: ContractDto) => {
        confirm({
          title: "Xác nhận xóa hợp đồng",
          content: `Bạn có chắc chắn muốn xóa hợp đồng ${record.contractNumber || ""}?`,
          onOk: () => deleteContractMutation.mutateAsync(record.id),
        });
      },
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
        value ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag>,
    },
    {
      title: "Tính bảo hiểm",
      dataIndex: "isInsuranceBased",
      key: "isInsuranceBased",
      width: 140,
      render: (value: boolean) =>
        value ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag>,
    },
  ];

  const allowanceTypeActions: TableAction[] = [
    {
      key: "view",
      label: "",
      icon: <EyeOutlined />,
      type: "default",
      tooltip: "Chi tiết",
      onClick: (record: AllowanceTypeDto) =>
        router.push(
          ROUTES.MAIN.PAYROLL_MANAGER.children.CONTRACTS.children.DETAIL_ALLOWANCE_TYPE.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      type: "default",
      tooltip: "Cập nhật",
      onClick: (record: AllowanceTypeDto) => openEditAllowanceType(record),
    },
    {
      key: "delete",
      label: "",
      icon: <DeleteOutlined />,
      type: "default",
      danger: true,
      tooltip: "Xóa",
      disabled: () => deleteAllowanceTypeMutation.isPending,
      onClick: (record: AllowanceTypeDto) => {
        confirm({
          title: "Xác nhận xóa loại phụ cấp",
          content: `Bạn có chắc chắn muốn xóa loại phụ cấp ${record.name || ""}?`,
          onOk: () => deleteAllowanceTypeMutation.mutateAsync(record.id),
        });
      },
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
        resolveEmployeeName(record.contract),
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
  ];

  const contractAllowanceActions: TableAction[] = [
    {
      key: "view",
      label: "",
      icon: <EyeOutlined />,
      type: "default",
      tooltip: "Chi tiết",
      onClick: (record: ContractAllowanceDto) =>
        router.push(
          ROUTES.MAIN.PAYROLL_MANAGER.children.CONTRACTS.children.DETAIL_CONTRACT_ALLOWANCE.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "edit",
      label: "",
      icon: <EditOutlined />,
      type: "default",
      tooltip: "Cập nhật",
      onClick: (record: ContractAllowanceDto) =>
        openEditContractAllowance(record),
    },
    {
      key: "delete",
      label: "",
      icon: <DeleteOutlined />,
      type: "default",
      danger: true,
      tooltip: "Xóa",
      disabled: () => deleteContractAllowanceMutation.isPending,
      onClick: (record: ContractAllowanceDto) => {
        confirm({
          title: "Xác nhận xóa phụ cấp hợp đồng",
          content: "Bạn có chắc chắn muốn xóa phụ cấp hợp đồng này?",
          onOk: () => deleteContractAllowanceMutation.mutateAsync(record.id),
        });
      },
    },
  ];

  return (
    <BaseView>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
        items={[
          {
            key: "contracts",
            label: "Hợp đồng",
            children: (
              <>
                <FilterComponent
                  fields={contractFilterFields}
                  filters={contractFilter}
                  onFiltersChange={setContractFilter}
                  onSearch={() => handleSearchContracts(false)}
                  onClear={() => {
                    setContractFilter(initContractFilter);
                    handleSearchContracts(true);
                  }}
                />
                <TableCustom
                  rowKey="id"
                  bordered
                  size="middle"
                  columns={contractColumns}
                  actions={contractActions}
                  actionsFixed="right"
                  data={contracts}
                  loading={loadingContracts}
                  scroll={{ x: "max-content" }}
                  customToolbar={
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={openCreateContract}
                    >
                      Thêm hợp đồng
                    </Button>
                  }
                  pagination={{
                    current:
                      Math.floor(
                        contractPagination.skip / contractPagination.take,
                      ) + 1,
                    pageSize: contractPagination.take,
                    total: totalContracts,
                    showSizeChanger: true,
                  }}
                  onPageChange={(page, pageSize) => {
                    setContractPagination((prev) => ({
                      ...prev,
                      skip: (page - 1) * pageSize,
                      take: pageSize,
                    }));
                  }}
                />
              </>
            ),
          },
          {
            key: "allowanceTypes",
            label: "Loại phụ cấp",
            children: (
              <>
                <FilterComponent
                  fields={allowanceTypeFilterFields}
                  filters={allowanceTypeFilter}
                  onFiltersChange={setAllowanceTypeFilter}
                  onSearch={() => handleSearchAllowanceTypes(false)}
                  onClear={() => {
                    setAllowanceTypeFilter(initAllowanceTypeFilter);
                    handleSearchAllowanceTypes(true);
                  }}
                />
                <TableCustom
                  rowKey="id"
                  bordered
                  size="middle"
                  columns={allowanceTypeColumns}
                  actions={allowanceTypeActions}
                  actionsFixed="right"
                  data={allowanceTypes}
                  loading={loadingAllowanceTypes}
                  scroll={{ x: "max-content" }}
                  customToolbar={
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={openCreateAllowanceType}
                    >
                      Thêm loại phụ cấp
                    </Button>
                  }
                  pagination={{
                    current:
                      Math.floor(
                        allowanceTypePagination.skip /
                          allowanceTypePagination.take,
                      ) + 1,
                    pageSize: allowanceTypePagination.take,
                    total: totalAllowanceTypes,
                    showSizeChanger: true,
                  }}
                  onPageChange={(page, pageSize) => {
                    setAllowanceTypePagination((prev) => ({
                      ...prev,
                      skip: (page - 1) * pageSize,
                      take: pageSize,
                    }));
                  }}
                />
              </>
            ),
          },
          {
            key: "contractAllowances",
            label: "Phụ cấp theo hợp đồng",
            children: (
              <>
                <FilterComponent
                  fields={contractAllowanceFilterFields}
                  filters={contractAllowanceFilter}
                  onFiltersChange={setContractAllowanceFilter}
                  onSearch={() => handleSearchContractAllowances(false)}
                  onClear={() => {
                    setContractAllowanceFilter(initContractAllowanceFilter);
                    handleSearchContractAllowances(true);
                  }}
                />
                <TableCustom
                  rowKey="id"
                  bordered
                  size="middle"
                  columns={contractAllowanceColumns}
                  actions={contractAllowanceActions}
                  actionsFixed="right"
                  data={contractAllowances}
                  loading={loadingContractAllowances}
                  scroll={{ x: "max-content" }}
                  customToolbar={
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={openCreateContractAllowance}
                    >
                      Thêm phụ cấp hợp đồng
                    </Button>
                  }
                  pagination={{
                    current:
                      Math.floor(
                        contractAllowancePagination.skip /
                          contractAllowancePagination.take,
                      ) + 1,
                    pageSize: contractAllowancePagination.take,
                    total: totalContractAllowances,
                    showSizeChanger: true,
                  }}
                  onPageChange={(page, pageSize) => {
                    setContractAllowancePagination((prev) => ({
                      ...prev,
                      skip: (page - 1) * pageSize,
                      take: pageSize,
                    }));
                  }}
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
