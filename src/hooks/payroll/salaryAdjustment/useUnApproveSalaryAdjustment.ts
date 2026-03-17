import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useUnApproveSalaryAdjustment = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onUnApproveSalaryAdjustment, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) => {
        const url = API_ENDPOINTS.SALARY_ADJUSTMENT.UNAPPROVE(id);
        return rootApiService.post<SuccessResponse>(url, {});
      },
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Hủy duyệt điều chỉnh lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Hủy duyệt điều chỉnh lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onUnApproveSalaryAdjustment, isLoading };
};
