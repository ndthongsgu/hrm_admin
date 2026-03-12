import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useApproveSalaryAdjustment = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onApproveSalaryAdjustment, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<SuccessResponse>(
          `${API_ENDPOINTS.SALARY_ADJUSTMENT.FIND_BY_ID(id)}/approve`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Duyệt điều chỉnh lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Duyệt điều chỉnh lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onApproveSalaryAdjustment, isLoading };
};
