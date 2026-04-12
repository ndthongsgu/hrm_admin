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
    { key: "3", label: "Người tạo bảng lương", value: data?.createBy },
    { 
      key: "4", 
      label: "Trạng thái duyệt", 
      value: (
        <Tag color={PAYSLIP_STATUS[data?.status as keyof typeof PAYSLIP_STATUS]?.color || "gold"}>
          {PAYSLIP_STATUS[data?.status as keyof typeof PAYSLIP_STATUS]?.label || "Chờ duyệt"}
        </Tag>
      ) 
    },
    // Thu nhập
    { key: "5", section: "II. THU NHẬP", label: "II. THU NHẬP", value: '' , bold: true  },
    { key: "6", label: "(1) Lương cơ sở", value: formatCurrency(data?.grossSalary)},
    { key: "6", label: "(2) Số ngày công tính lương", value:data?.totalWorkdays || 0},
    { key: "6", label: "(3) Số ngày công thực tế", value:data?.workdays || 0},
    { key: "6", label: "(4) Lương thanh toán theo công = (1) * (3) / (2)", value: formatCurrency(data?.salaryByWorkdays) },
    { key: "7", label: "(5) Phụ cấp chịu thuế + tính bảo hiểm", value: formatCurrency(data?.taxableAndInsurableAllowance) },
    { key: "8", label: "(6) Phụ cấp chịu thuế + không tính bảo hiểm", value: formatCurrency(data?.taxableAndNonInsurableAllowance) },
    { key: "9", label: "(7) Phụ cấp không chịu thuế + tính bảo hiểm", value: formatCurrency(data?.nonTaxableAndInsurableAllowance) },
    { key: "10", label: "(8) Phụ cấp không chịu thuế + không tính bảo hiểm", value: formatCurrency(data?.nonTaxableAndNonInsurableAllowance) },
    { key: "11", label: "(9) Thưởng/Phạt chịu thuế", value: formatCurrency(data?.totalBonus) },
    { key: "12", label: "(10) Thưởng/Phạt không chịu thuế", value: formatCurrency(data?.totalBonusNonTax) },
    // Bảo hiểm xã hội
    { key: "13", section: "III. BẢO HIỂM XÃ HỘI", label: "III. BẢO HIỂM XÃ HỘI", value: '' , bold: true  },
    { key: "14", label: "(11) Cơ sở tính bảo hiểm", value: formatCurrency(data?.bhxhSalaryBase) },
    { key: "15", label: "(12) Lương đóng bảo hiểm = (5) + (7) + (11)", value: formatCurrency(data?.bhxhSalaryBase || 0 + (data?.taxableAndInsurableAllowance || 0) + (data?.nonTaxableAndInsurableAllowance || 0)) },
    { key: "16", label: "(13) BHXH", value: formatCurrency(data?.bhxhAmount) },
    { key: "17", label: "(14) BHYT", value: formatCurrency(data?.bhytAmount) },
    { key: "18", label: "(15) BHTN", value: formatCurrency(data?.bhtnAmount) },
    { key: "19", label: "(16) Tổng bảo hiểm = (13) + (14) + (15)", value: formatCurrency((data?.bhxhAmount || 0) + (data?.bhytAmount || 0) + (data?.bhtnAmount || 0)), bold: true },
    // PIT
    { key: "20", section: "IV. THUẾ THU NHẬP CÁ NHÂN (PIT)", label: "IV. THUẾ THU NHẬP CÁ NHÂN (PIT)", value: '' , bold: true  },
    { key: "21", label: "(17) Thu nhập chịu thuế = (4) + (5) + (6) + (9)", value: formatCurrency(data?.taxableIncome) },
    { key: "22", label: "(18) Giảm trừ cá nhân", value: formatCurrency(data?.deductionPersonal) },
    { key: "23", label: "(19) Giảm trừ người phụ thuộc", value: formatCurrency(data?.deductionDependents) },
    { key: "24", label: "(20) Giảm trừ cố định", value: formatCurrency(data?.taxFixedDeduction) },
    { key: "25", label: "(21) Tổng giảm trừ = (16) + (18) + (19)", value: formatCurrency(data?.totalDeductions) },
    { key: "26", label: "(22) Thu nhập tính thuế = (17) - (21)", value: formatCurrency(data?.assessableIncome), bold: true },
    { key: "26", label: "(23) Thuế suất áp dụng", value: '' + (data?.taxRate || 0) + ' %', bold: true },
    { key: "27", label: "(24) Tiền thuế phải nộp = (22) * (23) - (20)", value: formatCurrency(data?.taxAmount), bold: true },
    // Kết quả
    { key: "28", section: "V. KẾT QUẢ CUỐI CÙNG", label: "Thực nhận = (7) + (8) + (10) + (17) - (24)", value: formatCurrency(data?.netSalary), bold: true, highlight: true },
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
