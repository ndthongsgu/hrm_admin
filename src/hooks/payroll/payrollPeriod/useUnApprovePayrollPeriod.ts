import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useUnApprovePayrollPeriod = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onUnApprovePayrollPeriod, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) => {
        const url = API_ENDPOINTS.PAYROLL_PERIOD.UNAPPROVE(id);
        return rootApiService.post<SuccessResponse>(url, {});
      },
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Hủy duyệt kỳ lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Hủy duyệt kỳ lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onUnApprovePayrollPeriod, isLoading };
};
