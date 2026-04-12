import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import type { SuccessResponse } from "@/dto/pagination.dto";
import { useToast } from "@/hooks/layout/useToast";

export const useBulkUnApproveSalaryAdjustment = () => {
  const showToast = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: onBulkUnApproveSalaryAdjustment } = useMutation({
    mutationFn: (ids: string[]) =>
    {
      return rootApiService.post<SuccessResponse>(API_ENDPOINTS.SALARY_ADJUSTMENT.BULK_UNAPPROVE, { ids })
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
        message: error?.response?.data?.message || "Có lỗi xảy ra khi hủy duyệt điều chỉnh lương",
        title: "Lỗi",
      });
    },
  });

  return { onBulkUnApproveSalaryAdjustment };
};