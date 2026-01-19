import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { PaymentMethodDto } from "@/dto/paymentMethod.dto";
import { useDetailPaymentMethod } from "@/hooks/payment-method";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DetailPaymentMethodScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailPaymentMethod(id ?? "");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết phương thức thanh toán</Title>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Chi tiết phương thức thanh toán",
            key: "1",
            children: data ? <DetailView data={data} /> : <Loading />,
          },
          {
            label: "Lịch sử thao tác",
            key: "2",
            children: (
              <ActionLogView functionType="PaymentMethods" functionId={id ?? ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: PaymentMethodDto }) => {
  const router = useRouter();

  return (
    <div className="p-4">
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            Thông tin phương thức thanh toán
          </Text>
        }
        style={{ marginBottom: "24px", padding: "24px" }}
      >
        <Row gutter={[32, 32]}>
          <Col span={12}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "14px",
                    display: "block",
                    color: "#06498B",
                  }}
                >
                  Mã phương thức
                </Text>
                <Text strong style={{ fontSize: "18px" }}>
                  {data?.code}
                </Text>
              </Col>

              <Col span={24}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "14px",
                    display: "block",
                    color: "#06498B",
                  }}
                >
                  Tên phương thức
                </Text>
                <Text strong style={{ fontSize: "18px" }}>
                  {data?.name}
                </Text>
              </Col>

              <Col span={24}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "14px",
                    display: "block",
                    color: "#06498B",
                  }}
                >
                  Mô tả
                </Text>
                <Text strong style={{ fontSize: "18px" }}>
                  {data?.description || "N/A"}
                </Text>
              </Col>

              <Col span={24}>
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
                <Tag color={!data?.isDeleted ? "green" : "red"} style={{ fontSize: "16px" }}>
                  {!data?.isDeleted ? "Hoạt động" : "Không hoạt động"}
                </Tag>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Nút quay lại */}
      <Row align="middle" justify="center" className="mt-6">
        <Button
          type="default"
          size="large"
          icon={<LeftCircleOutlined />}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </Row>
    </div>
  );
};
