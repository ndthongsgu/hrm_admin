import { useState, useEffect } from "react";
import { useRouter } from "@/routes/hooks";
import { ROUTES } from "@/common/constants/routes";
import { PAYROLL_PERIOD_STATUS, PAYSLIP_STATUS } from "@/common/constants/payrollPeriod";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, { type FilterField } from "@/components/filter/FilterCustom";
import type { TableAction } from "@/components/table/Table";
import Table from "@/components/table/Table";
import type { PaginationDto } from "@/dto/base.dto";
import type { PayslipDto } from "@/dto/payroll.dto";
import Can from "@/components/auth/Can";
import { ModuleCode } from "@/dto/auth.dto";
import PayslipPrintModal from "@/components/payslip-print/PayslipPrintModal";
import {
  usePaginationPayslips,
  useApprovePayslip,
  useDeactivatePayslip,
  useActivatePayslip,
  usePayrollPeriodSelectOptions,
  useEmployeeSelectOptions,
  useGeneratePayslip,
  useUnApprovePayslip,
  useExportMonthlyPayslipReport,
  useBulkApprovePayslip,
  useBulkUnApprovePayslip,
  useGetPayslipIdsByFilter,
  useGenerateBulkPayslip,
} from "@/hooks/payroll";
import { useConfirm } from "@/hooks/layout/useConfirm";
import {
  EyeOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  PlusOutlined,
  CloseOutlined,
  FilePdfOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { Tag, Modal, Button, Form, Select, Row, Col, Checkbox, Badge, Space } from "antd";

const initFilter = {
  payrollPeriodId: "",
  employeeId: "",
  status: undefined,
};

export default function PayslipManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<Record<string, any>>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<Record<string, any>>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [generateForm] = Form.useForm();
  const [generateLoading, setGenerateLoading] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipDto | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  const { data, total, isLoading } = usePaginationPayslips(pagination);
  const { onApprovePayslip } = useApprovePayslip();
  const { onUnApprovePayslip } = useUnApprovePayslip();
  const { onDeactivatePayslip } = useDeactivatePayslip();
  const { onActivatePayslip } = useActivatePayslip();
  const { onGeneratePayslip } = useGeneratePayslip();
  const { onExportMonthlyPayslipReport, isLoading: isExportingReport } = useExportMonthlyPayslipReport();
  const { confirm } = useConfirm();
  const { data: payrollPeriodOptions } = usePayrollPeriodSelectOptions();
  const { data: employeeOptions } = useEmployeeSelectOptions();
  const { mutateAsync: getIdsByFilter } = useGetPayslipIdsByFilter();
  const { onBulkApprovePayslip } = useBulkApprovePayslip();
  const { onBulkUnApprovePayslip } = useBulkUnApprovePayslip();
  const { onGenerateBulkPayslip } = useGenerateBulkPayslip();

  useEffect(() => {
    setSelectedIds([]);
    setAllSelected(false);
  }, [pagination.where]);

  const selectedPayrollPeriod = payrollPeriodOptions?.find(
    (option: any) => option.id === filter.payrollPeriodId,
  );

  const isPayrollPeriodApprovedForExport =
    selectedPayrollPeriod?.status === undefined
      ? true
      : selectedPayrollPeriod.status === PAYROLL_PERIOD_STATUS.APPROVED.value;

  const isExportDisabled =
    !filter.payrollPeriodId ||
    !isPayrollPeriodApprovedForExport ||
    isExportingReport;

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "payrollPeriodId",
      label: "Kỳ lương",
      type: "select",
      placeholder: "Chọn kỳ lương",
      options: payrollPeriodOptions?.map((option: any) => ({ label: option.name, value: option.id })) || [],
      col: 6,
    },
    {
      key: "employeeId",
      label: "Nhân viên",
      type: "select",
      placeholder: "Chọn nhân viên",
      options: employeeOptions?.map((option: any) => ({ label: `${option.code} - ${option.name}`.trim(), value: option.id })) || [],
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái duyệt",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Tất cả", value: undefined },
        { label: PAYSLIP_STATUS.APPROVED.label, value: PAYSLIP_STATUS.APPROVED.value },
        { label: PAYSLIP_STATUS.PENDING.label, value: PAYSLIP_STATUS.PENDING.value },
      ],
      col: 6,
    },
  ];

  const [columnWidths] = useState<Record<string, number>>({
    employeeName: 180,
    payrollPeriodName: 140,
    grossSalary: 140,
    netSalary: 140,
    status: 120,
    actions: 200,
  });

  const handleSelectAll = async (e: any) => {
    const checked = e.target.checked;
    if (checked) {
      // Get all IDs by filter
      const ids = await getIdsByFilter({
        where: pagination.where,
      });
      setSelectedIds(ids || []);
      setAllSelected(true);
    } else {
      setSelectedIds([]);
      setAllSelected(false);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      setAllSelected(false);
    }
  };

  const columns = [
    {
      title: (
        <Checkbox
          checked={allSelected}
          onChange={handleSelectAll}
          indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
        />
      ),
      dataIndex: "checkbox",
      key: "checkbox",
      width: 50,
      render: (_: any, record: any) => (
        <Checkbox
          checked={selectedIds.includes(record.id)}
          onChange={(e) => handleSelectOne(record.id, e.target.checked)}
        />
      ),
    },
    {
      title: "Nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
      width: columnWidths.employeeName,
      render: (name: string, record: PayslipDto) =>
        `${record.employeeCode || ""} - ${name || ""}`.trim(),
    },
    {
      title: "Kỳ lương",
      dataIndex: "payrollPeriodName",
      key: "payrollPeriodName",
      width: columnWidths.payrollPeriodName,
    },
    {
      title: "Lương cơ sở",
      dataIndex: "grossSalary",
      key: "grossSalary",
      width: columnWidths.grossSalary,
      align: "right" as const,
      render: (salary: number) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(salary || 0);
      },
    },
    {
      title: "Lương ròng",
      dataIndex: "netSalary",
      key: "netSalary",
      width: columnWidths.netSalary,
      align: "right" as const,
      render: (salary: number) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(salary || 0);
      },
    },
    {
      title: "Trạng thái duyệt",
      dataIndex: "status",
      key: "status",
      width: columnWidths.status,
      render: (status: string) => {
        const statusConfig = PAYSLIP_STATUS[status as keyof typeof PAYSLIP_STATUS] || PAYSLIP_STATUS.PENDING;
        return (
          <Tag color={statusConfig.color}>
            {statusConfig.label}
          </Tag>
        );
      },
    },
  ];

  const actions: TableAction[] = [
    {
      key: "view",
      label: "",
      icon: <EyeOutlined />,
      showKey: "isCanView",
      type: "default",
      tooltip: "Xem chi tiết",
      onClick: (record: PayslipDto) => {
        router.push(
          ROUTES.MAIN.PAYROLL_MANAGER.children.PAYSLIPS.children.DETAIL_PAYSLIP.path.replace(
            ":id",
            record.id!,
          ),
        );
      },
    },
    {
      key: "print-pdf",
      label: "",
      icon: <FilePdfOutlined />,
      type: "default",
      tooltip: "In PDF",
      hidden: (record: PayslipDto) => record.status !== PAYSLIP_STATUS.APPROVED.value || record.isDeleted === true,
      onClick: (record: PayslipDto) => {
        setSelectedPayslip(record);
        setPrintModalVisible(true);
      },
    },
    {
      key: "approve",
      label: "",
      icon: <CheckOutlined />,
      showKey: "isCanApprove",
      type: "default",
      tooltip: "Duyệt",
      hidden: (record: PayslipDto) => record.status !== PAYSLIP_STATUS.PENDING.value || record.isDeleted === true,
      onClick: async (record: PayslipDto) => {
        confirm({
          title: "Xác nhận duyệt phiếu lương",
          content: `Bạn có chắc chắn muốn duyệt phiếu lương cho ${record.employeeName}?`,
          onOk: () => {
            onApprovePayslip(record.id!)
          },
        });
      },
    },
    {
      key: "unapprove",
      label: "",
      icon: <CloseOutlined />,
      showKey: "isCanApprove",
      type: "default",
      tooltip: "Hủy duyệt",
      hidden: (record: PayslipDto) => record.status === PAYSLIP_STATUS.PENDING.value || record.isDeleted === true,
      onClick: async (record: PayslipDto) => {
        confirm({
          title: "Xác nhận hủy duyệt phiếu lương",
          content: `Bạn có chắc chắn muốn hủy duyệt phiếu lương cho ${record.employeeName}?`,
          onOk: () => {
            onUnApprovePayslip(record.id!)
          },
        });
      },
    },
    {
      key: "deactivate",
      label: "",
      icon: <StopOutlined />,
      showKey: "isCanDeactivate",
      type: "default",
      tooltip: "Ngừng hoạt động",
      hidden: (record: PayslipDto) => record.isDeleted !== false || record.status !== PAYSLIP_STATUS.PENDING.value,
      onClick: async (record: PayslipDto) => {
        confirm({
          title: "Xác nhận ngừng hoạt động",
          content: `Bạn có chắc chắn muốn ngừng hoạt động phiếu lương cho ${record.employeeName}?`,
          onOk: () => {
            onDeactivatePayslip(record.id!)
          },
        });
      },
    },
    {
      key: "activate",
      label: "",
      icon: <CheckCircleOutlined />,
      showKey: "isCanActivate",
      type: "default",
      tooltip: "Kích hoạt lại",
      hidden: (record: PayslipDto) => record.isDeleted !== true || record.status !== PAYSLIP_STATUS.PENDING.value,
      onClick: async (record: PayslipDto) => {
        confirm({
          title: "Xác nhận kích hoạt lại",
          content: `Bạn có chắc chắn muốn kích hoạt lại phiếu lương cho ${record.employeeName}?`,
          onOk: () => {
            onActivatePayslip(record.id!)
          },
        });
      },
    },
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleGeneratePayslip = async () => {
    try {
      const values = await generateForm.validateFields();
      setGenerateLoading(true);

      const employeeIds = Array.isArray(values.employeeId) ? values.employeeId : [values.employeeId].filter(Boolean);

      if (employeeIds.length > 1) {
        // Bulk generate
        await onGenerateBulkPayslip({
          payrollPeriodId: values.payrollPeriodId,
          employeeIds: employeeIds,
        });
      } else if (employeeIds.length === 1) {
        // Single generate
        await onGeneratePayslip({
          payrollPeriodId: values.payrollPeriodId,
          employeeId: employeeIds[0],
        });
      }

      setGenerateModalVisible(false);
      generateForm.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleExportMonthlyReport = async () => {
    if (!filter.payrollPeriodId || isExportDisabled) {
      return;
    }

    await onExportMonthlyPayslipReport({
      payrollPeriodId: filter.payrollPeriodId,
    });
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    confirm({
      title: "Xác nhận duyệt hàng loạt",
      content: `Bạn có chắc chắn muốn duyệt ${selectedIds.length} phiếu lương?`,
      onOk: async () => {
        await onBulkApprovePayslip(selectedIds);
        setSelectedIds([]);
        setAllSelected(false);
      },
    });
  };

  const handleBulkUnApprove = () => {
    if (selectedIds.length === 0) return;
    confirm({
      title: "Xác nhận hủy duyệt hàng loạt",
      content: `Bạn có chắc chắn muốn hủy duyệt ${selectedIds.length} phiếu lương?`,
      onOk: async () => {
        await onBulkUnApprovePayslip(selectedIds);
        setSelectedIds([]);
        setAllSelected(false);
      },
    });
  };

  return (
    <BaseView>
      
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
      {selectedIds.length > 0 && (
        <Row justify="space-between" align="middle">
          <span>Đã chọn {selectedIds.length} mục</span>
          <Space>
            <Badge count={data?.filter(record => selectedIds.includes(record.id) && record.status === PAYSLIP_STATUS.PENDING.value).length || 0}>
              <Button type="primary" onClick={handleBulkApprove}>
                Duyệt hàng loạt
              </Button>
            </Badge>
            <Badge count={data?.filter(record => selectedIds.includes(record.id) && record.status === PAYSLIP_STATUS.APPROVED.value).length || 0}>
              <Button danger onClick={handleBulkUnApprove}>
                Hủy duyệt hàng loạt
              </Button>
            </Badge>
          </Space>
        </Row>
      )}
      <Row gutter={[16, 16]} style={{ margin: "16px 0" }}>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setGenerateModalVisible(true)}
          >
            Tính lương
          </Button>
        </Col>
        <Col>
          <Can moduleCode={ModuleCode.PAYROLL} action="isCanExport">
            <Button
              icon={<ExportOutlined />}
              loading={isExportingReport}
              disabled={isExportDisabled}
              onClick={handleExportMonthlyReport}
            >
              Xuất báo cáo PDF tháng
            </Button>
          </Can>
        </Col>
      </Row>
      <Table
        data={data}
        columns={columns}
        actions={actions}
        loading={isLoading}
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total,
          showSizeChanger: true,
        }}
        onPageChange={handlePageChange}
      />

      <Modal
        title="Tính lương"
        open={generateModalVisible}
        onOk={handleGeneratePayslip}
        onCancel={() => {
          setGenerateModalVisible(false);
          generateForm.resetFields();
        }}
        okText="Tính lương"
        cancelText="Hủy"
        confirmLoading={generateLoading}
        width={500}
      >
        <Form
          form={generateForm}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="payrollPeriodId"
            label="Kỳ lương"
            rules={[
              { required: true, message: "Vui lòng chọn kỳ lương" },
            ]}
          >
            <Select
              placeholder="Chọn kỳ lương"
              options={payrollPeriodOptions?.map((option: any) => ({
                label: option.name,
                value: option.id,
              })) || []}
            />
          </Form.Item>

          <Form.Item
            name="employeeId"
            label="Nhân viên"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất một nhân viên" },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn nhân viên (có thể chọn nhiều)"
              options={employeeOptions?.map((option: any) => ({
                label: `${option.name}`.trim(),
                value: option.id,
              })) || []}
            />
          </Form.Item>
        </Form>
      </Modal>

      <PayslipPrintModal
        visible={printModalVisible}
        data={selectedPayslip}
        onClose={() => {
          setPrintModalVisible(false);
          setSelectedPayslip(null);
        }}
      />
    </BaseView>
  );
}
