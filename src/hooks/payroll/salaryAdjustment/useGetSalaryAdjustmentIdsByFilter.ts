import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import type { SalaryAdjustmentSearchRequest } from "@/dto/payroll.dto";

export const useGetSalaryAdjustmentIdsByFilter = () => {
  return useMutation({
    mutationFn: (request: SalaryAdjustmentSearchRequest) =>
      rootApiService.post<string[]>(
        API_ENDPOINTS.SALARY_ADJUSTMENT.IDS_BY_FILTER,
        {
          body: request,
        },
      ),
  });
};