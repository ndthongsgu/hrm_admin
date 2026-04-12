import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export interface GenerateBulkPayslipParams {
  payrollPeriodId: string;
  employeeIds: string[];
}

export const useGenerateBulkPayslip = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onGenerateBulkPayslip, isPending: isLoading } =
    useMutation({
      mutationFn: (params: GenerateBulkPayslipParams) =>
        rootApiService.post<string>(
          API_ENDPOINTS.PAYSLIP.GENERATE_BULK_FOR_EMPLOYEES(params.payrollPeriodId),
          { ids: params.employeeIds },
        ),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYSLIP.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: data || "Tạo phiếu lương hàng loạt thành công",
        });
        // Invalidate payslip queries to refresh the list
        queryClient.invalidateQueries({ queryKey: ["payslips"] });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Tạo phiếu lương hàng loạt thất bại",
        });
      },
    });

  return {
    onGenerateBulkPayslip,
    isLoading,
  };
};