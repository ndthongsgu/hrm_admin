import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useDeactivatePayslip = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeactivatePayslip, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.delete<SuccessResponse>(
          API_ENDPOINTS.PAYSLIP.FIND_BY_ID(id),
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYSLIP.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Ngưng hoạt động phiếu lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Ngưng hoạt động phiếu lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onDeactivatePayslip, isLoading };
};
