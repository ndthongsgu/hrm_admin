import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useRejectPayslip = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onRejectPayslip, isPending: isLoading } =
    useMutation({
      mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
        rootApiService.post<SuccessResponse>(
          `${API_ENDPOINTS.PAYSLIP.FIND_BY_ID(id)}/reject?reason=${reason || ""}`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYSLIP.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Từ chối duyệt phiếu lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Từ chối duyệt phiếu lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onRejectPayslip, isLoading };
};
