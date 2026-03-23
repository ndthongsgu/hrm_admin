/**
 * Hook để xử lý và trích xuất error message từ API response
 */
export const useApiError = () => {
  /**
   * Trích xuất error message từ AxiosError
   * @param error - AxiosError từ API call
   * @returns Error message dạng string
   */
  const getErrorMessage = (error: any): string => {
    // Priority order: custom errorMessage > response message > error message > generic message

    // 1. Check custom errorMessage attached by axios interceptor
    if (error?.errorMessage) {
      return error.errorMessage;
    }

    // 2. Check response.data.message (BaseResponse format)
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    // 3. Check response.data.error
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }

    // 4. Check response.statusText
    if (error?.response?.statusText) {
      const statusText = error.response.statusText;
      const status = error.response.status;
      return `${statusText} (${status})`;
    }

    // 5. Check error.message from AxiosError
    if (error?.message) {
      return error.message;
    }

    // 6. Default message
    return "Có lỗi xảy ra. Vui lòng thử lại.";
  };

  /**
   * Trích xuất tất cả thông tin lỗi
   * @param error - AxiosError từ API call
   * @returns Object chứa thông tin lỗi
   */
  const getErrorDetail = (error: any) => {
    return {
      message: getErrorMessage(error),
      status: error?.response?.status || null,
      statusText: error?.response?.statusText || null,
      data: error?.response?.data || null,
      isNetwork: error?.code === "ECONNABORTED" || error?.message?.includes("ERR_NETWORK"),
      isTimeout: error?.code === "ECONNABORTED" || error?.message?.includes("timeout"),
    };
  };

  /**
   * Hiển thị error message dựa trên HTTP status code
   * @param error - AxiosError từ API call
   * @returns Object chứa error type và message
   */
  const getErrorByStatus = (error: any) => {
    const status = error?.response?.status;
    const message = getErrorMessage(error);

    switch (status) {
      case 400:
        return {
          type: "validation",
          message: message,
          title: "Dữ liệu không hợp lệ",
        };
      case 401:
        return {
          type: "unauthorized",
          message: message || "Vui lòng đăng nhập lại",
          title: "Xác thực thất bại",
        };
      case 403:
        return {
          type: "forbidden",
          message: message || "Bạn không có quyền truy cập",
          title: "Truy cập bị từ chối",
        };
      case 404:
        return {
          type: "notfound",
          message: message || "Không tìm thấy tài nguyên",
          title: "Không tìm thấy",
        };
      case 409:
        return {
          type: "conflict",
          message: message,
          title: "Xung đột dữ liệu",
        };
      case 500:
        return {
          type: "server",
          message: message || "Lỗi máy chủ nội bộ",
          title: "Lỗi máy chủ",
        };
      default:
        return {
          type: "unknown",
          message: message,
          title: "Có lỗi xảy ra",
        };
    }
  };

  return {
    getErrorMessage,
    getErrorDetail,
    getErrorByStatus,
  };
};
