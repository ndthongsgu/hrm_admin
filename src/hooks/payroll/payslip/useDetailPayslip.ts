import type { PayslipDto } from "@/dto/payroll.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useDetailPayslip = (id: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYSLIP.FIND_BY_ID(id)],
    queryFn: () =>
      rootApiService.get<PayslipDto>(API_ENDPOINTS.PAYSLIP.FIND_BY_ID(id)),
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};
