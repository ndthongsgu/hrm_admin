import {
  DownloadOutlined,
  EditOutlined,
  PlusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { ActionButton } from ".";

export const CommonActions = {
  create: (onClick?: () => void): ActionButton => ({
    key: "create",
    label: "Tạo mới",
    icon: <PlusCircleOutlined />,
    type: "primary",
    onClick,
  }),
  update: (onClick?: () => void): ActionButton => ({
    key: "update",
    label: "Cập nhật",
    icon: <EditOutlined />,
    onClick,
  }),
  exportTemplate: (onClick?: () => void): ActionButton => ({
    key: "export-template",
    label: "Xuất template",
    icon: <DownloadOutlined />,
    onClick,
  }),
  upload: (
    onDownloadTemplate?: () => void,
    onUploadFile?: (file: File) => void,
    popoverTitle?: string
  ): ActionButton => ({
    key: "upload",
    label: "Nhập excel",
    icon: <DownloadOutlined />,
    popoverTitle: popoverTitle || "Chọn hành động",
    popoverPlacement: "bottomLeft",
    subActions: [
      {
        key: "download-template",
        label: "Tải excel mẫu",
        icon: <UploadOutlined />,
        onClick: onDownloadTemplate,
      },
      {
        key: "upload-file",
        label: "Nhập excel",
        icon: <DownloadOutlined />,
        onClick: onUploadFile as any,
      },
    ],
  }),
  exportExcel: (onClick?: () => void): ActionButton => ({
    key: "export-excel",
    label: "Xuất excel",
    icon: <UploadOutlined />,
    onClick,
  }),
};
