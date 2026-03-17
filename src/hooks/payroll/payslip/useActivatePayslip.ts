import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useActivatePayslip = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivatePayslip, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) => {
        const url = API_ENDPOINTS.PAYSLIP.ACTIVATE(id);
        return rootApiService.put<SuccessResponse>(url, {});
      },
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYSLIP.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Hoạt động lại phiếu lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Hoạt động lại phiếu lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onActivatePayslip, isLoading };
};
