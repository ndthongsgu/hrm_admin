import type { PayrollPeriodDto } from "@/dto/payroll.dto";
import type { SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useCreatePayrollPeriod = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();

  const { mutateAsync: onCreatePayrollPeriod, isPending: isLoading } =
    useMutation({
      mutationFn: (body: PayrollPeriodDto) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.PAYROLL_PERIOD.CREATE,
          body,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tạo kỳ lương thành công!",
          title: "Thành công",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tạo kỳ lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onCreatePayrollPeriod, isLoading };
};
