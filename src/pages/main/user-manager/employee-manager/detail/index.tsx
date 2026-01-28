import { formatDate } from "@/common/helpers/format";
import ActionLogView from "@/components/action-log";
import BaseView from "@/components/base-view/BaseView";
import Loading from "@/components/loading/Loading";
import Title from "@/components/title";
import type { EmployeeDto } from "@/dto/employee.dto";
import { useDetailEmployee } from "@/hooks/employee";
import { useRouter } from "@/routes/hooks";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Tabs, Tag, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export default function DetailEmployeeScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailEmployee(id ?? "");
  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseView isLoading={isLoading}>
      <Title>Xem chi tiết nhân viên</Title>
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
              <ActionLogView functionType="Employees" functionId={id || ""} />
            ),
          },
        ]}
      />
    </BaseView>
  );
}

const DetailView = ({ data }: { data: EmployeeDto }) => {
  const router = useRouter();

  return (
    <div style={{ padding: "16px 0" }}>
      {/* I. Thông tin cơ bản */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            I. Thông tin cơ bản
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
              Mã nhân viên
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
              Họ và tên
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.fullName}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Ngày sinh
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.dateOfBirth ? formatDate(data.dateOfBirth) : "Không có"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Giới tính
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.gender === "MALE" ? "Nam" : data?.gender === "FEMALE" ? "Nữ" : "Khác"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Email
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.email || "Không có"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Số điện thoại
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.phoneNumber || "Không có"}
            </Text>
          </Col>
          <Col span={24} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Địa chỉ
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.address || "Không có"}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* II. Thông tin công việc */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            II. Thông tin công việc
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[24, 24]}>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Phòng ban
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.departmentName || "Không có"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Chức vụ
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.positionName || "Không có"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Ngày vào làm
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.hireDate ? formatDate(data.hireDate) : "Không có"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Trạng thái
            </Text>
            <Tag color={data?.isActive ? "green" : "red"} style={{ fontSize: "14px" }}>
              {data?.isActive ? "Hoạt động" : "Không hoạt động"}
            </Tag>
          </Col>
        </Row>
      </Card>

      {/* III. Thông tin bảo hiểm & thuế */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            III. Thông tin bảo hiểm & thuế
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
              Mã số thuế
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.taxCode || "Không có"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Số BHXH
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.socialInsuranceNumber || "Không có"}
            </Text>
          </Col>
          <Col span={8} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Số BHYT
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.healthInsuranceNumber || "Không có"}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* IV. Thông tin ngân hàng */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            IV. Thông tin ngân hàng
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[24, 24]}>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Số tài khoản
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.bankAccount || "Không có"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Ngân hàng
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.bankName || "Không có"}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* V. Liên hệ khẩn cấp */}
      <Card
        title={
          <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
            V. Liên hệ khẩn cấp
          </Text>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[24, 24]}>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Người liên hệ
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.emergencyContact || "Không có"}
            </Text>
          </Col>
          <Col span={12} style={{ padding: "20px" }}>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block", color: "#06498B" }}
            >
              Số điện thoại khẩn cấp
            </Text>
            <Text strong style={{ fontSize: "18px" }}>
              {data?.emergencyPhone || "Không có"}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* VI. Ghi chú */}
      {data?.notes && (
        <Card
          title={
            <Text strong style={{ fontSize: "18px", color: "#06498B" }}>
              VI. Ghi chú
            </Text>
          }
          style={{ marginBottom: "24px" }}
        >
          <Text strong style={{ fontSize: "16px" }}>
            {data?.notes}
          </Text>
        </Card>
      )}

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
