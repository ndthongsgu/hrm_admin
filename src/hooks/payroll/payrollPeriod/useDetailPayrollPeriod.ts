import type { PayrollPeriodDto } from "@/dto/payroll.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useDetailPayrollPeriod = (id: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(id)],
    queryFn: () =>
      rootApiService.get<PayrollPeriodDto>(
        API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(id),
      ),
    enabled: !!id,
  });

  if (data) {
    data.dateRange =
      data.startDate && data.endDate
        ? [new Date(data.startDate), new Date(data.endDate)]
        : undefined;
  }

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};
