
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const usePayrollPeriodSelectOptions = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.SELECT_OPTIONS],
    queryFn: () =>
      rootApiService.get<any>(
        API_ENDPOINTS.PAYROLL_PERIOD.SELECT_OPTIONS,
      ),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};
