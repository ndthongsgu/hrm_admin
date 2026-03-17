import type { SalaryAdjustmentDto } from "@/dto/payroll.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useDetailSalaryAdjustment = (id: string) => {
  const { data: rawData, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.FIND_BY_ID(id)],
    queryFn: () =>
      rootApiService.get<SalaryAdjustmentDto>(
        API_ENDPOINTS.SALARY_ADJUSTMENT.FIND_BY_ID(id),
      ),
    enabled: !!id,
  });

  // Enrich data with payrollPeriodId and employeeId
  const data = rawData
    ? {
        ...rawData,
        payrollPeriodId: rawData.payrollPeriod?.id || "",
        employeeId: rawData.employee?.id || "",
      }
    : undefined;

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};
