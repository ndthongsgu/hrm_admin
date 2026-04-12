import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";

export const useGetPayslipIdsByFilter = () => {
  return useMutation({
    mutationFn: (filters: Record<string, any>) =>
      rootApiService.post<string[]>(
        API_ENDPOINTS.PAYSLIP.IDS_BY_FILTER,
        {
          body: filters,
        },
      ),
  });
};