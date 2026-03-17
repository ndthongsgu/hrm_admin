import { useCallback } from "react";

interface ConfirmOptions {
  title: string;
  content: string;
  onOk: () => void | Promise<void>;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
}

import { App } from "antd";

export function useConfirm() {
  const { modal } = App.useApp();

  const confirm = useCallback((options: ConfirmOptions) => {
    modal.confirm({
      title: options.title,
      content: options.content,
      onOk: async () => {
        try {
          await Promise.resolve(options.onOk());
        } catch (error) {
          console.error("Confirm action failed:", error);
          throw error;
        }
      },
      onCancel: options.onCancel,
      okText: options.okText || "Xác nhận",
      cancelText: options.cancelText || "Hủy",
    });
  }, [modal]);

  return { confirm };
}