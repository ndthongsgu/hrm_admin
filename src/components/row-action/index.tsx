import { Button, Menu, Popover, Space } from "antd";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";

export interface SubAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface ActionButton {
  key: string;
  label: string;
  icon?: ReactNode;
  type?: "default" | "primary" | "dashed" | "link" | "text";
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
  size?: "small" | "middle" | "large";
  className?: string;
  style?: CSSProperties;
  subActions?: SubAction[];
  popoverTitle?: string;
  popoverPlacement?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom";
}

export interface RowActionsProps {
  actions: ActionButton[];
  style?: CSSProperties;
  size?: "small" | "middle" | "large";
  direction?: "horizontal" | "vertical";
  align?: "start" | "end" | "center" | "baseline";
  wrap?: boolean;
}

const RowActions = ({
  actions,
  style = {},
  size = "middle",
  direction = "horizontal",
  align = "start",
  wrap = false,
}: RowActionsProps) => {
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handlePopoverVisibleChange = (visible: boolean, actionKey: string) => {
    setOpenPopovers((prev) => ({
      ...prev,
      [actionKey]: visible,
    }));
  };

  const handleSubActionClick = (subAction: SubAction, actionKey: string) => {
    if (subAction.key === "upload-file") {
      const inputId = `file-input-${actionKey}`;
      const fileInput = fileInputRefs.current[inputId];
      if (fileInput) fileInput.click();
    } else {
      subAction.onClick?.();
    }

    setOpenPopovers((prev) => ({
      ...prev,
      [actionKey]: false,
    }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onUploadFile?: (file: File) => void
  ) => {
    const file = event.target.files?.[0];
    if (file && onUploadFile) onUploadFile(file);
    event.target.value = "";
  };

  const renderButton = (action: ActionButton) => {
    const button = (
      <Button
        key={action.key}
        type={action.type || "default"}
        icon={action.icon}
        onClick={action.subActions ? undefined : action.onClick}
        loading={action.loading}
        disabled={action.disabled}
        danger={action.danger}
        size={action.size || size}
        className={action.className}
        style={action.style}
      >
        {action.label}
      </Button>
    );

    if (!action.subActions || action.subActions.length === 0) return button;

    const uploadFileAction = action.subActions.find(
      (sub) => sub.key === "upload-file"
    );
    const inputId = `file-input-${action.key}`;

    const menuItems = action.subActions.map((subAction) => ({
      key: subAction.key,
      label: subAction.label,
      icon: subAction.icon,
      disabled: subAction.disabled,
      danger: subAction.danger,
      onClick: () => handleSubActionClick(subAction, action.key),
    }));

    return (
      <div key={action.key}>
        <Popover
          content={<Menu items={menuItems} />}
          title={action.popoverTitle}
          trigger="click"
          placement={action.popoverPlacement || "bottomLeft"}
          open={openPopovers[action.key] || false}
          onOpenChange={(visible) =>
            handlePopoverVisibleChange(visible, action.key)
          }
        >
          {button}
        </Popover>

        {uploadFileAction && (
          <input
            ref={(el) => {
              fileInputRefs.current[inputId] = el;
            }}
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, uploadFileAction.onClick)}
          />
        )}
      </div>
    );
  };

  return (
    <Space
      style={{ ...style }}
      size={size}
      direction={direction}
      align={align}
      wrap={wrap}
    >
      {actions.map(renderButton)}
    </Space>
  );
};

export default RowActions;
