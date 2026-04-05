import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailContractAllowance } from "@/hooks/contract";
import { useRouter } from "@/routes/hooks";
import { Button, Descriptions, Space, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const formatCurrency = (value?: number) =>
  value !== undefined && value !== null
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
    : "-";

export default function DetailContractAllowanceScreen() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useDetailContractAllowance(id ?? "");

  if (isLoading) return <Loading />;

  return (
    <BaseView>
      <Title level={4} style={{ marginTop: 0 }}>Chi tiết phụ cấp theo hợp đồng</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Hợp đồng">{data?.contract?.contractNumber || "-"}</Descriptions.Item>
        <Descriptions.Item label="Nhân viên">
          {data?.contract?.employee?.fullName || data?.contract?.employee?.name || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Loại phụ cấp">{data?.allowanceType?.name || "-"}</Descriptions.Item>
        <Descriptions.Item label="Số tiền">{formatCurrency(data?.amount)}</Descriptions.Item>
      </Descriptions>
      <Space style={{ marginTop: 16 }}>
        <Button onClick={() => router.back()}>Quay lại</Button>
      </Space>
    </BaseView>
  );
}
