import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useLockPayrollPeriod = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onLockPayrollPeriod, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<SuccessResponse>(
          `${API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(id)}/lock`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Chốt kỳ lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Chốt kỳ lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onLockPayrollPeriod, isLoading };
};
