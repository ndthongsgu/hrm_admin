import type { PayrollPeriodDto } from "@/dto/payroll.dto";
import type { SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useUpdatePayrollPeriod = (id: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();

  const { mutateAsync: onUpdatePayrollPeriod, isPending: isLoading } =
    useMutation({
      mutationFn: (body: PayrollPeriodDto) =>
        rootApiService.put<SuccessResponse>(
          API_ENDPOINTS.PAYROLL_PERIOD.UPDATE(id),
          body,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật kỳ lương thành công!",
          title: "Thành công",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Cập nhật kỳ lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onUpdatePayrollPeriod, isLoading };
};
