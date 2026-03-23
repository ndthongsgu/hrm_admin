import { Modal, Button, Divider, Row, Col } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import type { PayslipDto } from "@/dto/payroll.dto";
import { PAYSLIP_STATUS } from "@/common/constants/payrollPeriod";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PayslipPrintModalProps {
  visible: boolean;
  data: PayslipDto | null;
  onClose: () => void;
}

const formatCurrency = (value: number | undefined) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);
};

const SignatureBox = ({ label }: { label: string }) => (
  <div style={{ textAlign: "center", marginBottom: "30px" }}>
    <div style={{ minHeight: "30px", marginBottom: "5px" }}></div>
    <div style={{ fontSize: "12px", fontWeight: 600, fontFamily: '"Times New Roman", Times, serif' }}>{label}</div>
  </div>
);

const PrintContent = ({ data }: { data: PayslipDto }) => (
  <div
    id="payslip-print-content"
    style={{
      padding: "30px 40px",
      fontSize: "11px",
      fontFamily: '"Times New Roman", Times, serif',
      lineHeight: 1.4,
    }}
  >
    {/* Header */}
    <div style={{ textAlign: "center", marginBottom: "5px" }}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '11px'}}>
            <p style={{fontWeight: 'bold', fontSize: '14px', margin: '0'}}>CÔNG TY TNHH VTECH</p>
            <div style={{textAlign: 'right'}}>
                <p style={{fontWeight: 'bold', margin: '0', fontSize: '10px', textAlign: 'center'}}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p style={{fontWeight: 'bold', margin: '0', fontSize: '10px', textAlign: 'center', marginBottom: '5px'}}>Độc lập - Tự do - Hạnh phúc</p>
                <p style={{fontStyle: 'italic', margin: '0', fontSize: '9px'}}>Tp Hồ Chí Minh, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
            </div>
        </div>
      <h2 style={{ margin: "3px 0", fontSize: '16px', fontWeight: 'bold' }}>PHIẾU LƯƠNG</h2>
    </div>

    <Divider style={{ margin: "5px 0" }} />

    {/* Salary Details Table */}
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead></thead>
      <tbody>
        {/* Thông tin cơ bản */}
        <tr style={{ backgroundColor: "#f0f0f0" }}>
          <td style={{ padding: "4px 6px", fontWeight: "bold" }}>
            I. THÔNG TIN CƠ BẢN
          </td>
          <td></td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>Nhân viên</td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {data?.employee?.fullName} ({data?.employee?.employeeCode})
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>Kỳ lương</td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {data?.payrollPeriod?.name}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            Người tạo bảng lương
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {data?.createBy}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            Trạng thái duyệt
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {PAYSLIP_STATUS[data?.status as keyof typeof PAYSLIP_STATUS]
              ?.label || "Chờ duyệt"}
          </td>
        </tr>

        {/* Thu nhập */}
        <tr style={{ backgroundColor: "#f0f0f0" }}>
          <td style={{ padding: "4px 6px", fontWeight: "bold" }}>II. THU NHẬP</td>
          <td></td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (1) Lương cơ sở
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.grossSalary)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (2) Số ngày công tính lương
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {data?.totalWorkdays || 0}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (3) Số ngày công thực tế
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {data?.totalWorkdays || 0}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (4) Lương thanh toán theo công = (1) * (3) / (2)
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.salaryByWorkdays)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (5) Phụ cấp chịu thuế + tính bảo hiểm
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.taxableAndInsurableAllowance)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (6) Phụ cấp chịu thuế + không tính bảo hiểm
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.taxableAndNonInsurableAllowance)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (7) Phụ cấp không chịu thuế + tính bảo hiểm
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.nonTaxableAndInsurableAllowance)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (8) Phụ cấp không chịu thuế + không tính bảo hiểm
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.nonTaxableAndNonInsurableAllowance)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (9) Thưởng/Phạt chịu thuế
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.totalBonus)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (10) Thưởng/Phạt không chịu thuế
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.totalBonusNonTax)}
          </td>
        </tr>

        {/* Bảo hiểm */}
        <tr style={{ backgroundColor: "#f0f0f0" }}>
          <td style={{ padding: "4px 6px", fontWeight: "bold" }}>
            III. BẢO HIỂM XÃ HỘI
          </td>
          <td></td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (11) Cơ sở tính bảo hiểm
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.bhxhSalaryBase)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (12) Lương đóng bảo hiểm = (5) + (7) + (11)
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(
              (data?.bhxhSalaryBase || 0) +
                (data?.taxableAndInsurableAllowance || 0) +
                (data?.nonTaxableAndInsurableAllowance || 0),
            )}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>(13) BHXH</td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.bhxhAmount)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>(14) BHYT</td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.bhytAmount)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>(15) BHTN</td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.bhtnAmount)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (16) Tổng bảo hiểm = (13) + (14) + (15)
          </td>
          <td
            style={{ textAlign: "right", padding: "4px 6px", fontWeight: "bold" }}
          >
            {formatCurrency(
              (data?.bhxhAmount || 0) +
                (data?.bhytAmount || 0) +
                (data?.bhtnAmount || 0),
            )}
          </td>
        </tr>

        {/* Thuế */}
        <tr style={{ backgroundColor: "#f0f0f0" }}>
          <td style={{ padding: "4px 6px", fontWeight: "bold" }}>
            IV. THUẾ THU NHẬP CÁ NHÂN (PIT)
          </td>
          <td></td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (17) Thu nhập chịu thuế = (4) + (5) + (6) + (9)
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.taxableIncome)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (18) Giảm trừ cá nhân
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.deductionPersonal)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (19) Giảm trừ người phụ thuộc
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.deductionDependents)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (20) Giảm trừ cố định
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.taxFixedDeduction)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (21) Tổng giảm trừ = (16) + (18) + (19)
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(
              (data?.deductionPersonal || 0) + (data?.deductionDependents || 0),
            )}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (22) Thu nhập tính thuế = (17) - (21)
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {formatCurrency(data?.assessableIncome)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (23) Thuế suất áp dụng
          </td>
          <td style={{ textAlign: "right", padding: "4px 6px" }}>
            {data?.taxRate || 0}%
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 6px", paddingLeft: "15px" }}>
            (24) Tiền thuế phải nộp = (22) * (23) - (20)
          </td>
          <td
            style={{ textAlign: "right", padding: "4px 6px", fontWeight: "bold" }}
          >
            {formatCurrency(data?.taxAmount)}
          </td>
        </tr>

        {/* Kết quả */}
        <tr style={{ backgroundColor: "#fffacd", borderTop: "2px solid #000" }}>
          <td style={{ padding: "4px 6px", fontWeight: "bold", fontSize: "12px" }}>
            V. Thực nhận = (7) + (8) + (10) + (17) - (24)
          </td>
          <td
            style={{
              textAlign: "right",
              padding: "4px 6px",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            {formatCurrency(data?.netSalary)}
          </td>
        </tr>
      </tbody>
    </table>

    <Divider style={{ margin: "3px 0" }} />

    {/* Signatures */}
    <div style={{ marginBottom: "20px" }}>
      <Row gutter={[16, 0]}>
        <Col span={8}>
          <SignatureBox label="Giám đốc" />
        </Col>
        <Col span={8}>
          <SignatureBox label="Kế toán" />
        </Col>
        <Col span={8}>
          <SignatureBox label="Nhân viên" />
        </Col>
      </Row>
    </div>

    {/* Print Styles */}
    <style>{`
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        .print-container {
          page-break-after: always;
        }
      }
    `}</style>
  </div>
);

export default function PayslipPrintModal({
  visible,
  data,
  onClose,
}: PayslipPrintModalProps) {
  const handlePrint = async () => {
    try {
      const element = document.getElementById("payslip-print-content");
      if (!element) return;

      // Capture HTML as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/png");

      let heightLeft = imgHeight;
      let position = 0;

      // Add pages if content is longer than one page
      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297; // A4 height in mm
        position -= 297;
        if (heightLeft > 0) {
          pdf.addPage();
        }
      }

      // Download PDF
      const fileName = `Bảng_lương_${data?.employee?.fullName}_${data?.payrollPeriod?.name || ""}`.replace(
        /\s+/g,
        "_"
      );
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Modal
      title="In bảng lương"
      open={visible}
      onCancel={onClose}
      width={900}
      bodyStyle={{ maxHeight: "80vh", overflow: "auto" }}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
        >
          Tải PDF
        </Button>,
      ]}
    >
      {data && <PrintContent data={data} />}
    </Modal>
  );
}
