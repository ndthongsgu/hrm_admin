import { PlusOutlined } from "@ant-design/icons";
import { Form, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useEffect, useState } from "react";

export interface FileDto {
  id?: string;
  fileUrl: string;
  fileName: string;
}

interface FileUploadProps {
  label?: string;
  name?: string;
  required?: boolean;
  type?: "document" | "image" | "all";
  maxSize?: number;
  onFileUploaded?: (files: FileDto[] | FileDto) => void;
  initValue?: FileDto[] | FileDto;
  mode?: "single" | "multi";
  style?: React.CSSProperties;
}

/* ---------------- Helper ---------------- */
const getAcceptType = (type: FileUploadProps["type"]) => {
  switch (type) {
    case "document":
      return ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";
    case "image":
      return "image/*";
    default:
      return "";
  }
};

const mapInitValueToFileList = (
  initValue?: FileDto[] | FileDto,
  mode: "single" | "multi" = "single"
): UploadFile[] => {
  if (!initValue) return [];
  if (mode === "multi" && Array.isArray(initValue)) {
    return initValue.map((f) => ({
      uid: f.id || f.fileName,
      name: f.fileName,
      status: "done" as const,
      url: f.fileUrl,
      response: f.fileUrl,
    })) as UploadFile[];
  }
  const file = Array.isArray(initValue) ? initValue[0] : initValue;
  return [
    {
      uid: file.id || file.fileName,
      name: file.fileName,
      status: "done" as const,
      url: file.fileUrl,
      response: file.fileUrl,
    },
  ] as UploadFile[];
};

/* ---------------- Component ---------------- */
function FileUpload({
  label = "File",
  name = "file",
  required = false,
  type = "all",
  maxSize = 10,
  onFileUploaded,
  initValue,
  mode = "single",
  style,
}: FileUploadProps) {
  const [fileList, setFileList] = useState<UploadFile[]>(() =>
    mapInitValueToFileList(initValue, mode)
  );

  const uploadProps: UploadProps = {
    fileList,
    multiple: mode === "multi",
    accept: getAcceptType(type),
    beforeUpload: (file) => {
      if (file.size / 1024 / 1024 > maxSize) {
        message.error(`File phải nhỏ hơn ${maxSize}MB`);
        return Upload.LIST_IGNORE;
      }
      if (type === "image" && !file.type.startsWith("image/")) {
        message.error("Chỉ chấp nhận file hình ảnh!");
        return Upload.LIST_IGNORE;
      }
      if (mode === "single" && fileList.length >= 1) {
        message.error("Chỉ được tải lên 1 file");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: (info) => {
      let newList = info.fileList;
      if (mode === "single") newList = newList.slice(-1);
      setFileList(newList);
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  useEffect(() => {
    if (onFileUploaded) {
      const files = fileList.map((f) => ({
        id: f.uid,
        fileUrl: f.response || f.url || "",
        fileName: f.name,
      }));
      onFileUploaded(mode === "single" ? files[0] : files);
    }
  }, [fileList, mode, onFileUploaded]);

  const showUploadButton =
    mode === "multi" || (mode === "single" && fileList.length === 0);

  return (
    <Form.Item
      label={label}
      name={name}
      style={style}
      rules={
        required
          ? [{ required: true, message: `Vui lòng tải lên ${label}` }]
          : []
      }
    >
      <Upload listType="picture-card" {...uploadProps}>
        {showUploadButton && <PlusOutlined />}
      </Upload>
      <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
        {type === "image"
          ? "Chấp nhận: Hình ảnh"
          : "Chấp nhận: Tất cả các file"}{" "}
        - Tối đa {maxSize}MB
      </div>
    </Form.Item>
  );
}

export default FileUpload;
