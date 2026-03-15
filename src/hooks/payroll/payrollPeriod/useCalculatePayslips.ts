import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useCalculatePayslips = (payrollPeriodId: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onCalculatePayslips, isPending: isLoading } =
    useMutation({
      mutationFn: () =>
        rootApiService.post<SuccessResponse>(
          `${API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(payrollPeriodId)}/calculate-payslips`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYSLIP.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tính lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tính lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onCalculatePayslips, isLoading };
};
