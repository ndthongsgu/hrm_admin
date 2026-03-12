import type { SuccessResponse } from "@/dto/pagination.dto";
import type { SalaryAdjustmentDto } from "@/dto/payroll.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useUpdateSalaryAdjustment = (id: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { push } = useRouter();

  const { mutateAsync: onUpdateSalaryAdjustment, isPending: isLoading } =
    useMutation({
      mutationFn: (data: Partial<SalaryAdjustmentDto>) =>
        rootApiService.put<SuccessResponse>(
          API_ENDPOINTS.SALARY_ADJUSTMENT.FIND_BY_ID(id),
          data,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật điều chỉnh lương thành công!",
          title: "Thành công",
        });
        push("/salary-adjustment");
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Cập nhật điều chỉnh lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onUpdateSalaryAdjustment, isLoading };
};
