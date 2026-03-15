import type { SuccessResponse } from "@/dto/pagination.dto";
import type { SalaryAdjustmentDto } from "@/dto/payroll.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useCreateSalaryAdjustment = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();

  const { mutateAsync: onCreateSalaryAdjustment, isPending: isLoading } =
    useMutation({
      mutationFn: (data: Partial<SalaryAdjustmentDto>) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.SALARY_ADJUSTMENT.CREATE,
          data,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tạo điều chỉnh lương thành công!",
          title: "Thành công",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tạo điều chỉnh lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onCreateSalaryAdjustment, isLoading };
};
