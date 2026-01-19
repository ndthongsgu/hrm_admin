import { formatDateTime } from "@/common/helpers/format";
import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { CarTypeDto } from "@/dto/carType.dto";
import { useDetailCarType } from "@/hooks/car-type";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DetailCarTypeScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailCarType(id ?? "");
  if (isLoading) {
    return <Loading />;
  }
  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết loại xe</Title>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết",
            key: "1",
            children: data ? <DetailView data={data} /> : <Loading />,
          },
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: (
              <ActionLogView functionType="CarTypes" functionId={id ?? ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: CarTypeDto }) => {
  const router = useRouter();

  return (
    <div style={{ padding: "16px 0" }}>
      {/* I. Thông tinxe */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin loại xe
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[24, 24]}>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Mã loại xe
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.code}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Tên loại xe
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.name}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Ngày thêm vào
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {formatDateTime(data?.createdDate)}
            </Text>
          </Col>
          <Col span={12}>
            <Text
              type="secondary"
              style={{
                fontSize: "14px",
                display: "block",
                color: "#06498B",
              }}
            >
              Trạng thái
            </Text>
            <Tag color={data.isDeleted ? "red" : "green"}>
              {data.isDeleted ? "Không hoạt động" : "Hoạt động"}
            </Tag>
          </Col>

          <Col span={24} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Mô tả
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.description || "Không có"}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Action Button */}
      <Row align={"middle"} justify={"center"}>
        <Button
          type="default"
          size="middle"
          icon={<LeftCircleOutlined />}
          onClick={() => router.back()}
        >
          Thoát
        </Button>
      </Row>
    </div>
  );
};
