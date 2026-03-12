import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useSummarizeAttendance = (payrollPeriodId: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onSummarizeAttendance, isPending: isLoading } =
    useMutation({
      mutationFn: () =>
        rootApiService.post<SuccessResponse>(
          `${API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(payrollPeriodId)}/summarize-attendance`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.ATTENDANCE_SUMMARY.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tổng hợp công thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tổng hợp công thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onSummarizeAttendance, isLoading };
};
