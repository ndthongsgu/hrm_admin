import { Modal } from "antd";
import { useCallback } from "react";

interface ConfirmOptions {
  title: string;
  content: string;
  onOk: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
}

export function useConfirm() {
  const confirm = useCallback((options: ConfirmOptions) => {
    Modal.confirm({
      title: options.title,
      content: options.content,
      onOk: options.onOk,
      onCancel: options.onCancel,
      okText: options.okText || "Xác nhận",
      cancelText: options.cancelText || "Hủy",
    });
  }, []);

  return { confirm };
}