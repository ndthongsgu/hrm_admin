import axios from "axios";
import { API_ENDPOINTS } from "@/services";
import axiosInstance from "@/services/axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export interface ExportMonthlyPayslipReportParams {
  payrollPeriodId: string;
}

interface ExportFileResult {
  blob: Blob;
  filename: string;
}

const FALLBACK_FILENAME = "bao-cao-luong-thang.pdf";

const decodeFilename = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const parseFilenameFromContentDisposition = (
  contentDisposition?: string,
): string => {
  if (!contentDisposition) {
    return FALLBACK_FILENAME;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeFilename(utf8Match[1]);
  }

  const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i);
  if (quotedMatch?.[1]) {
    return quotedMatch[1];
  }

  const plainMatch = contentDisposition.match(/filename=([^;]+)/i);
  if (plainMatch?.[1]) {
    return plainMatch[1].trim();
  }

  return FALLBACK_FILENAME;
};

const extractErrorMessage = async (error: unknown): Promise<string> => {
  if (!axios.isAxiosError(error)) {
    return "Xuất báo cáo thất bại";
  }

  const responseData = error.response?.data;

  if (responseData instanceof Blob) {
    try {
      const text = await responseData.text();
      const parsed = JSON.parse(text);
      return parsed?.message || parsed?.error || "Xuất báo cáo thất bại";
    } catch {
      return "Xuất báo cáo thất bại";
    }
  }

  if (responseData && typeof responseData === "object") {
    const data = responseData as { message?: string; error?: string };
    return data.message || data.error || "Xuất báo cáo thất bại";
  }

  return error.message || "Xuất báo cáo thất bại";
};

const downloadBlobFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename || FALLBACK_FILENAME;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const useExportMonthlyPayslipReport = () => {
  const showToast = useToast();

  const { mutateAsync: onExportMonthlyPayslipReport, isPending: isLoading } =
    useMutation({
      mutationFn: async (
        params: ExportMonthlyPayslipReportParams,
      ): Promise<ExportFileResult> => {
        try {
          const response = await axiosInstance.get<Blob>(
            API_ENDPOINTS.PAYSLIP.EXPORT_MONTHLY_REPORT(params.payrollPeriodId),
            {
              responseType: "blob",
              headers: {
                Accept: "application/pdf",
              },
            },
          );

          const contentDisposition = response.headers["content-disposition"];
          const filename = parseFilenameFromContentDisposition(contentDisposition);

          return {
            blob: response.data,
            filename,
          };
        } catch (error) {
          throw new Error(await extractErrorMessage(error));
        }
      },
      onSuccess: ({ blob, filename }) => {
        downloadBlobFile(blob, filename);
        showToast({
          type: "success",
          title: "Thành công",
          message: "Đã tải báo cáo lương tháng",
        });
      },
      onError: (error: Error) => {
        showToast({
          type: "error",
          title: "Thất bại",
          message: error.message || "Xuất báo cáo thất bại",
        });
      },
    });

  return { onExportMonthlyPayslipReport, isLoading };
};
