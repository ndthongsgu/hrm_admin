import { message, notification, type NotificationArgsProps } from "antd";

export const toast = {
  success: (content: string) => message.success(content),
  error: (content: string) => message.error(content),
  info: (content: string) => message.info(content),
  warning: (content: string) => message.warning(content),
};

export const notify = (options: NotificationArgsProps) => {
  notification.open({ placement: "topRight", ...options });
};
