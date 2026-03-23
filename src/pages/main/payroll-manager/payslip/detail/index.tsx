import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailPayslip } from "@/hooks/payroll";
import { useRouter } from "@/routes/hooks";
import { PAYSLIP_STATUS } from "@/common/constants/payrollPeriod";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Space, Tag, Table } from "antd";
import { useParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";

export default function PayslipDetailScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailPayslip(id ?? "");
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  // Tạo dữ liệu cho bảng
  const tableData = [
    // Thông tin cơ bản
    { key: "1", section: "I. THÔNG TIN CƠ BẢN", label: "Nhân viên", value: `${data?.employee?.fullName} (${data?.employee?.employeeCode})`, bold: true },
    { key: "2", label: "Kỳ lương", value: data?.payrollPeriod?.name },
    { 
      key: "3", 
      label: "Trạng thái duyệt", 
      value: (
        <Tag color={PAYSLIP_STATUS[data?.status as keyof typeof PAYSLIP_STATUS]?.color || "gold"}>
          {PAYSLIP_STATUS[data?.status as keyof typeof PAYSLIP_STATUS]?.label || "Chờ duyệt"}
        </Tag>
      ) 
    },
    // Thu nhập
    { key: "4", section: "II. THU NHẬP", label: "II. THU NHẬP", value: '' , bold: true  },
    { key: "5", label: "(1) Lương cơ sở", value: formatCurrency(data?.grossSalary)},
    { key: "6", label: "(2) Lương thanh toán theo công", value: formatCurrency(data?.salaryByWorkdays) },
    { key: "7", label: "(3a) Phụ cấp chịu thuế + tính bảo hiểm", value: formatCurrency(data?.taxableAndInsurableAllowance) },
    { key: "8", label: "(3b) Phụ cấp chịu thuế + không tính bảo hiểm", value: formatCurrency(data?.taxableAndNonInsurableAllowance) },
    { key: "9", label: "(3c) Phụ cấp không chịu thuế + tính bảo hiểm", value: formatCurrency(data?.nonTaxableAndInsurableAllowance) },
    { key: "10", label: "(3d) Phụ cấp không chịu thuế + không tính bảo hiểm", value: formatCurrency(data?.nonTaxableAndNonInsurableAllowance) },
    { key: "11", label: "(4a) Thưởng/Phạt chịu thuế", value: formatCurrency(data?.totalBonus) },
    { key: "12", label: "(4b) Thưởng/Phạt không chịu thuế", value: formatCurrency(data?.totalBonusNonTax) },
    // Bảo hiểm xã hội
    { key: "13", section: "III. BẢO HIỂM XÃ HỘI", label: "III. BẢO HIỂM XÃ HỘI", value: '' , bold: true  },
    { key: "14", label: "(5) Cơ sở tính bảo hiểm", value: formatCurrency(data?.bhxhSalaryBase) },
    { key: "15", label: "(6) Lương đóng bảo hiểm = (5) + (3a) + (3c)", value: formatCurrency(data?.bhxhSalaryBase || 0 + (data?.taxableAndInsurableAllowance || 0) + (data?.nonTaxableAndInsurableAllowance || 0)) },
    { key: "16", label: "(7) BHXH (8%)", value: formatCurrency(data?.bhxhAmount) },
    { key: "17", label: "(8) BHYT (1.5%)", value: formatCurrency(data?.bhytAmount) },
    { key: "18", label: "(9) BHTN (1%)", value: formatCurrency(data?.bhtnAmount) },
    { key: "19", label: "(10)Tổng bảo hiểm = (7) + (8) + (9)", value: formatCurrency((data?.bhxhAmount || 0) + (data?.bhytAmount || 0) + (data?.bhtnAmount || 0)), bold: true },
    // PIT
    { key: "20", section: "IV. THUẾ THU NHẬP CÁ NHÂN (PIT)", label: "IV. THUẾ THU NHẬP CÁ NHÂN (PIT)", value: '' , bold: true  },
    { key: "21", label: "(11) Thu nhập chịu thuế = (2) + (3a) + (3b) + (4a)", value: formatCurrency(data?.taxableIncome) },
    { key: "22", label: "(12) Giảm trừ cá nhân", value: formatCurrency(data?.deductionPersonal) },
    { key: "23", label: "(13) Giảm trừ người phụ thuộc", value: formatCurrency(data?.deductionDependents) },
    { key: "24", label: "(14) Giảm trừ cố định", value: formatCurrency(data?.taxFixedDeduction) },
    { key: "25", label: "(15) Tổng giảm trừ = (10) + (12) + (13)", value: formatCurrency(data?.totalDeductions) },
    { key: "26", label: "(16) Thu nhập tính thuế = (11) - (15)", value: formatCurrency(data?.assessableIncome), bold: true },
    { key: "27", label: "(17) Tiền thuế phải nộp = (16) * thuế suất - (14)", value: formatCurrency(data?.taxAmount), bold: true },
    // Kết quả
    { key: "28", section: "V. KẾT QUẢ CUỐI CÙNG", label: "(18) Lương ròng =  + (3c) + (3d) + (4b) + (11) - (17)", value: formatCurrency(data?.netSalary), bold: true, highlight: true },
  ];

  const columns: ColumnsType<any> = [
    {
      title: "Mục",
      dataIndex: "label",
      key: "label",
      width: "50%",
      render: (text, record) => (
        <span style={{ fontWeight: record.bold ? "bold" : "normal", backgroundColor: record.highlight ? "#fffacd" : "transparent" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "value",
      key: "value",
      width: "50%",
      align: "right" as const,
      render: (text, record) => (
        <span style={{ fontWeight: record.bold ? "bold" : "normal", backgroundColor: record.highlight ? "#fffacd" : "transparent" }}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <BaseView>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card 
          title={`Bảng lương - ${data?.employee?.fullName} (${data?.payrollPeriod?.name})`}
          extra={
            <Tag color={PAYSLIP_STATUS[data?.status as keyof typeof PAYSLIP_STATUS]?.color || "gold"}>
              {PAYSLIP_STATUS[data?.status as keyof typeof PAYSLIP_STATUS]?.label || "Chờ duyệt"}
            </Tag>
          }
        >
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
            size="small"
            rowClassName={(record) => {
              if (record.section) return "section-header";
              if (record.highlight) return "highlight-row";
              return "";
            }}
            onRow={(record) => ({
              style: {
                backgroundColor: record.section ? "#f5f5f5" : record.highlight ? "#fffacd" : "transparent",
                fontWeight: record.section || record.bold ? "bold" : "normal",
              },
            })}
          />
          <style>{`
            .section-header {
              background-color: #f0f0f0 !important;
              font-weight: bold;
            }
            .section-header > td {
              background-color: #f0f0f0 !important;
              font-weight: bold;
              border-top: 2px solid #d9d9d9;
            }
            .highlight-row {
              background-color: #fffacd !important;
            }
            .highlight-row > td {
              background-color: #fffacd !important;
              font-weight: bold;
            }
          `}</style>
        </Card>

        <ActionLog functionId={id ?? ""} functionType="PAYSLIP" />
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            Quay lại
          </Button>
        </div>
      </Space>
    </BaseView>
  );
}
