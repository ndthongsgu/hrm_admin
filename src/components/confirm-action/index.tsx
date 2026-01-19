import { Input, Modal } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";

type ActionConfirmProps = {
  title: string;
  confirmText?: string;
  cancelText?: string;
  withReason?: boolean;
  isRequireReason?: boolean;
  onConfirm: (reason?: string) => void | Promise<void>;
  children?: React.ReactNode;
};

export type ActionConfirmRef = {
  show: () => void;
  hide: () => void;
};

const ActionConfirm = forwardRef<ActionConfirmRef, ActionConfirmProps>(
  (
    {
      title,
      confirmText = "Xác nhận",
      cancelText = "Hủy",
      withReason = false,
      isRequireReason = false,
      onConfirm,
      children,
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }));

    const handleOk = async () => {
      if (isRequireReason && !reason.trim()) return;

      setLoading(true);
      try {
        await onConfirm(reason);
        setReason("");
        setVisible(false);
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      setReason("");
      setVisible(false);
    };

    return (
      <>
        {children && <span onClick={() => setVisible(true)}>{children}</span>}
        <Modal
          open={visible}
          title={title}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={confirmText}
          cancelText={cancelText}
          confirmLoading={loading}
          okButtonProps={{ disabled: isRequireReason && !reason.trim() }}
        >
          {withReason && (
            <Input.TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do"
              rows={3}
            />
          )}
        </Modal>
      </>
    );
  }
);

ActionConfirm.displayName = "ActionConfirm";

export default ActionConfirm;
