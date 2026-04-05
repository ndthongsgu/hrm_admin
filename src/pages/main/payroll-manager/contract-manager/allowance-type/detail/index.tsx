import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailAllowanceType } from "@/hooks/contract";
import { useRouter } from "@/routes/hooks";
import { Button, Descriptions, Space, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Title } = Typography;

export default function DetailAllowanceTypeScreen() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useDetailAllowanceType(id ?? "");

  if (isLoading) return <Loading />;

  return (
    <BaseView>
      <Title level={4} style={{ marginTop: 0 }}>Chi tiết loại phụ cấp</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tên loại phụ cấp">{data?.name || "-"}</Descriptions.Item>
        <Descriptions.Item label="Tính thuế">
          {data?.isTaxable ? <Tag color="green">Có</Tag> : <Tag>Không</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Tính bảo hiểm">
          {data?.isInsuranceBased ? <Tag color="green">Có</Tag> : <Tag>Không</Tag>}
        </Descriptions.Item>
      </Descriptions>
      <Space style={{ marginTop: 16 }}>
        <Button onClick={() => router.back()}>Quay lại</Button>
      </Space>
    </BaseView>
  );
}
