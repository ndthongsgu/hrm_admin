import { useRouter } from "@/routes/hooks";
import { useDetailEmployee, useUploadKnownFaces, useGetKnownFaces, useDeleteKnownFace } from "@/hooks/employee";
import BaseView from "@/components/base-view/BaseView";
import {
  Button,
  Card,
  Col,
  Row,
  Spin,
  Upload,
  Form,
  Badge,
  Space,
  Result,
  Image,
  Modal,
  Popconfirm,
} from "antd";
import {
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
  const { deleteImage, isPending: isDeleting } = useDeleteKnownFace(employeeId || "");
  const { data: knownFacesData } = useGetKnownFaces(employeeId || "");

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
    Modal.confirm({
      title: "Xoá ảnh",
      content: "Bạn có chắc muốn xoá ảnh này?",
      okText: "Xoá",
      cancelText: "Huỷ",
      okButtonProps: { danger: true },
    });

    const newList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newList);
  };

  const handleDeleteExistingImage = (filename: string) => {
    if (employeeId) {
      deleteImage(filename);
    }
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
    router.back();
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

  const existingImages = knownFacesData?.images || [];

  return (
    <BaseView>
      <Card>
        <Row gutter={[16, 16]}>
          {/* Header */}
          <Col span={24}>
            <Row justify="space-between" align="middle">
              <Col>
                <h2 style={{ margin: 0 }}>
                  Quản lý ảnh nhân viên
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

          {/* Existing Known Faces */}
          {existingImages && existingImages.length > 0 && (
            <Col span={24}>
              <Card type="inner">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <strong>Ảnh đã tải lên ({existingImages.length})</strong>
                  </Col>
                  <Col span={24}>
                    <Row gutter={[16, 16]}>
                      {existingImages.map((image: any, index: number) => (
                        <Col key={index} xs={12} sm={8} md={6}>
                          <Card
                            style={{
                              padding: "8px",
                              textAlign: "center",
                              position: "relative",
                            }}
                            hoverable
                          >
                            <Image
                              src={image.url}
                              alt={image.filename}
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              preview
                            />
                            <div
                              style={{
                                marginTop: "8px",
                                fontSize: "12px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={image.filename}
                            >
                              {image.filename}
                            </div>
                            <Popconfirm
                              title="Xoá ảnh"
                              description="Bạn có chắc muốn xoá ảnh này?"
                              onConfirm={() => handleDeleteExistingImage(image.filename)}
                              okText="Xoá"
                              cancelText="Huỷ"
                              okButtonProps={{
                                danger: true,
                                loading: isDeleting,
                              }}
                              disabled={isDeleting}
                            >
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                style={{ marginTop: "8px", width: "100%" }}
                                loading={isDeleting}
                                disabled={isDeleting}
                              >
                                Xoá
                              </Button>
                            </Popconfirm>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          )}

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

          {/* Action Buttons */}
          <Col span={24}>
            <Space style={{ width: "100%" }} direction="vertical">
              <Space>
                <Button
                  type="primary"
                  size="middle"
                  onClick={handleUpload}
                  loading={isPending}
                  disabled={fileList.length === 0 || isPending}
                  icon={<CloudUploadOutlined />}
                >
                  Thêm {fileList.length > 0 && `(${fileList.length} ảnh)`}
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
