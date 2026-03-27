import ActionLog from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import { useDetailWorkShift } from "@/hooks/workshift";
import { useRouter } from "@/routes/hooks";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function WorkShiftDetailScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailWorkShift(id ?? "");
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  const goBack = () => {
    router.back();
  };

  const formatTime = (time?: string) => {
    return time || "-";
  };

  return (
    <BaseView>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="I. Thông tin cơ bản">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Tên ca làm việc</Text>
                <Text strong>{data?.name}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="II. Thời gian làm việc">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Giờ bắt đầu</Text>
                <Text strong>{formatTime(data?.startTime)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Giờ kết thúc</Text>
                <Text strong>{formatTime(data?.endTime)}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Thời gian nghỉ</Text>
                <Text strong>
                  {data?.breakStart && data?.breakEnd
                    ? `${data.breakStart} - ${data.breakEnd}`
                    : "-"}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="III. Cấu hình dung sai">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Dung sai muộn (phút)</Text>
                <Text strong>{data?.lateGraceMinutes || 0}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary">Dung sai về sớm (phút)</Text>
                <Text strong>{data?.earlyLeaveGraceMinutes || 0}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <ActionLog functionId={id ?? ""} functionType="WORK_SHIFT" />
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
            Quay lại
          </Button>
        </div>
      </Space>
    </BaseView>
  );
}
