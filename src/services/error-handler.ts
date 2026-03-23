import { message } from "antd";

/**
 * Utility để hiển thị error từ API
 */
export const showApiError = (error: any) => {
  let errorMessage = "Có lỗi xảy ra";

  // Trích xuất error message từ response
  if (error?.errorMessage) {
    // Custom errorMessage từ axios interceptor
    errorMessage = error.errorMessage;
  } else if (error?.response?.data?.message) {
    // BaseResponse format
    errorMessage = error.response.data.message;
  } else if (error?.response?.data?.error) {
    // Error field format
    errorMessage = error.response.data.error;
  } else if (error?.response?.statusText) {
    // HTTP status text
    errorMessage = `${error.response.statusText} (${error.response.status})`;
  } else if (error?.message) {
    // Generic message
    errorMessage = error.message;
  }

  // Hiển thị error message
  message.error(errorMessage);
};

/**
 * Utility để hiển thị success message
 */
export const showSuccess = (msg: string = "Thao tác thành công") => {
  message.success(msg);
};

/**
 * Utility để hiển thị warning message
 */
export const showWarning = (msg: string) => {
  message.warning(msg);
};

/**
 * Utility để hiển thị info message
 */
export const showInfo = (msg: string) => {
  message.info(msg);
};
