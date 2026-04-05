import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailContract } from "@/hooks/contract";
import { useRouter } from "@/routes/hooks";
import { Button, Descriptions, Space, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "-";

const formatCurrency = (value?: number) =>
  value !== undefined && value !== null
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
    : "-";

export default function DetailContractScreen() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useDetailContract(id ?? "");

  if (isLoading) return <Loading />;

  return (
    <BaseView>
      <Title level={4} style={{ marginTop: 0 }}>Chi tiết hợp đồng</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Số hợp đồng">{data?.contractNumber || "-"}</Descriptions.Item>
        <Descriptions.Item label="Nhân viên">{data?.employee?.fullName || data?.employee?.name || "-"}</Descriptions.Item>
        <Descriptions.Item label="Vị trí">{data?.position?.name || "-"}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {data?.status === "ACTIVE" ? <Tag color="green">ACTIVE</Tag> : <Tag>{data?.status || "-"}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Lương đóng BH">{formatCurrency(data?.baseSalary)}</Descriptions.Item>
        <Descriptions.Item label="Lương hợp đồng">{formatCurrency(data?.actualSalary)}</Descriptions.Item>
        <Descriptions.Item label="Kiểu lương">{data?.isNet ? "NET" : "GROSS"}</Descriptions.Item>
        <Descriptions.Item label="Ngày bắt đầu">{formatDate(data?.startDate)}</Descriptions.Item>
        <Descriptions.Item label="Ngày kết thúc">{formatDate(data?.endDate)}</Descriptions.Item>
      </Descriptions>
      <Space style={{ marginTop: 16 }}>
        <Button onClick={() => router.back()}>Quay lại</Button>
      </Space>
    </BaseView>
  );
}
