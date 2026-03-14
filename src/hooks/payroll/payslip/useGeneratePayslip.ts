import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export interface GeneratePayslipParams {
  payrollPeriodId: string;
  employeeId?: string;
}

export const useGeneratePayslip = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onGeneratePayslip, isPending: isLoading } =
    useMutation({
      mutationFn: (params: GeneratePayslipParams) => {
        const url = params.employeeId
          ? API_ENDPOINTS.PAYSLIP.GENERATE_FOR_EMPLOYEE(
              params.payrollPeriodId,
              params.employeeId,
            )
          : API_ENDPOINTS.PAYSLIP.GENERATE(params.payrollPeriodId);

        return rootApiService.post<SuccessResponse>(url, {});
      },
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYSLIP.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tính lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tính lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onGeneratePayslip, isLoading };
};
