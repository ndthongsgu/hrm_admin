import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useActivatePayrollPeriod = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivatePayrollPeriod, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.put<SuccessResponse>(
          `${API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(id)}/activate`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt lại kỳ lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Kích hoạt lại kỳ lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onActivatePayrollPeriod, isLoading };
};
