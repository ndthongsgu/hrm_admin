import { useState } from "react";
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
import { Tag, Modal, Button, Form, Select, Row, Col } from "antd";

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

  const columns = [
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

      await onGeneratePayslip({
        payrollPeriodId: values.payrollPeriodId,
        employeeId: values.employeeId || undefined,
      });

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
              { required: true, message: "Vui lòng chọn nhân viên" },
            ]}
          >
            <Select
              allowClear
              placeholder="Chọn nhân viên"
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
