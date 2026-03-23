import { useRouter } from "@/routes/hooks";
import { useDetailEmployee, useUploadKnownFaces } from "@/hooks/employee";
import { ROUTES } from "@/common/constants/routes";
import BaseView from "@/components/base-view/BaseView";
import {
  Button,
  Card,
  Col,
  Row,
  Spin,
  Empty,
  Upload,
  Form,
  Badge,
  Space,
  Result,
} from "antd";
import {
  ArrowLeftOutlined,
  CloudUploadOutlined,
  FileImageOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

interface FileWithPreview extends UploadFile {
  preview?: string;
}

export default function AddKnownFaceScreen() {
  const router = useRouter();
  const { id: employeeId } = useParams<{ id: string }>();
  const { data: employee, isLoading: employeeLoading } =
    useDetailEmployee(employeeId || "");
  const { upload, isPending } = useUploadKnownFaces();

  const [fileList, setFileList] = useState<FileWithPreview[]>([]);

  const handleFileChange = (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.filter((file) => {
      // Only keep pending or done files
      return file.status !== "error";
    });

    setFileList(newFileList);
  };

  const handleRemoveFile = (file: UploadFile) => {
    const newList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newList);
  };

  const handleUpload = () => {
    if (fileList.length === 0) {
      alert("Vui lòng chọn ít nhất một ảnh");
      return;
    }

    const files: File[] = [];
    for (const file of fileList) {
      if (file.originFileObj instanceof File) {
        files.push(file.originFileObj);
      }
    }

    if (files.length === 0) {
      alert("Vui lòng chọn ảnh hợp lệ");
      return;
    }

    if (employeeId) {
      upload({ employeeId, files });
    }
  };

  const handleReset = () => {
    setFileList([]);
  };

  const handleBack = () => {
    if (!employeeId) return;
    router.push(
      ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children
        .DETAIL_EMPLOYEE.path.replace(":id", employeeId)
    );
  };

  if (employeeLoading) {
    return (
      <BaseView>
        <Spin size="large" />
      </BaseView>
    );
  }

  if (!employee) {
    return (
      <BaseView>
        <Card>
          <Result
            status="error"
            title="Không tìm thấy nhân viên"
            subTitle="Vui lòng kiểm tra lại mã nhân viên"
            extra={
              <Button type="primary" onClick={handleBack}>
                Quay lại
              </Button>
            }
          />
        </Card>
      </BaseView>
    );
  }

  return (
    <BaseView>
      <Card>
        <Row gutter={[16, 16]}>
          {/* Header */}
          <Col span={24}>
            <Row justify="space-between" align="middle">
              <Col>
                <h2 style={{ margin: 0 }}>
                  <ArrowLeftOutlined
                    onClick={handleBack}
                    style={{ marginRight: 16, cursor: "pointer" }}
                  />
                  Thêm ảnh nhân viên
                </h2>
              </Col>
              <Col>
                <Badge
                  count={fileList.length}
                  title="Số ảnh đã chọn"
                  style={{ backgroundColor: "#52c41a" }}
                />
              </Col>
            </Row>
          </Col>

          {/* Employee Info */}
          <Col span={24}>
            <Card type="inner" style={{ backgroundColor: "#f5f5f5" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div>
                    <strong>Mã nhân viên:</strong> {employee.code || "N/A"}
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div>
                    <strong>Tên nhân viên:</strong> {employee.fullName || "N/A"}
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div>
                    <strong>Email:</strong> {employee.email || "N/A"}
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div>
                    <strong>Phòng ban:</strong>{" "}
                    {employee.departmentName || "N/A"}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Upload Area */}
          <Col span={24}>
            <Card type="inner">
              <Form layout="vertical">
                <Form.Item
                  label={
                    <strong>
                      <FileImageOutlined /> Chọn ảnh để upload
                    </strong>
                  }
                >
                  <Upload
                    multiple
                    accept="image/*"
                    maxCount={3}
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                    fileList={fileList}
                    listType="picture-card"
                    onRemove={handleRemoveFile}
                    className="known-face-upload"
                     style={{
                        width: '300px'
                    }}
                  >
                    <div className="upload-area">
                      <CloudUploadOutlined
                        style={{ fontSize: "32px", color: "#1890ff" }}
                      />
                      <p style={{ marginTop: "8px" }}>
                        Click hoặc kéo ảnh vào đây
                      </p>
                      <p style={{ color: "#666", fontSize: "12px" }}>
                        Hỗ trợ JPG, PNG, GIF, BMP. Tối đa 3 ảnh
                      </p>
                    </div>
                  </Upload>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* File List */}
          {fileList.length > 0 && (
            <Col span={24}>
              <Card type="inner" title="Danh sách ảnh đã chọn">
                <Row gutter={[16, 16]}>
                  {fileList.map((file) => (
                    <Col key={file.uid} xs={24} sm={12} lg={8}>
                      <Card size="small" hoverable>
                        <div style={{ position: "relative" }}>
                          {file.preview ? (
                            <img
                              src={file.preview}
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              alt={file.name}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "150px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "4px",
                              }}
                            >
                              <FileImageOutlined
                                style={{ fontSize: "32px", color: "#bfbfbf" }}
                              />
                            </div>
                          )}
                          <div
                            style={{
                              marginTop: "8px",
                              fontSize: "12px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={file.name}
                          >
                            {file.name}
                          </div>
                          <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveFile(file)}
                            style={{ marginTop: "8px", width: "100%" }}
                          >
                            Xoá
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          )}

          {/* Empty State */}
          {fileList.length === 0 && (
            <Col span={24}>
              <Empty
                description="Chưa chọn ảnh nào"
                style={{ marginTop: "20px" }}
              />
            </Col>
          )}

          {/* Action Buttons */}
          <Col span={24}>
            <Space style={{ width: "100%" }} direction="vertical">
              <Space>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleUpload}
                  loading={isPending}
                  disabled={fileList.length === 0 || isPending}
                  icon={<CloudUploadOutlined />}
                >
                  Upload {fileList.length > 0 && `(${fileList.length} ảnh)`}
                </Button>
                <Button
                  onClick={handleReset}
                  disabled={fileList.length === 0 || isPending}
                >
                  Làm mới
                </Button>
                <Button onClick={handleBack}>Huỷ</Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>
    </BaseView>
  );
}
