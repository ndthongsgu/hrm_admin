import type { SalaryAdjustmentDto } from "@/dto/payroll.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useDetailSalaryAdjustment = (id: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.FIND_BY_ID(id)],
    queryFn: () =>
      rootApiService.get<SalaryAdjustmentDto>(
        API_ENDPOINTS.SALARY_ADJUSTMENT.FIND_BY_ID(id),
      ),
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};
