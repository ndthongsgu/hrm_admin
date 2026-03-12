import type { PaginationDto } from "@/dto/base.dto";
import type {
  PayrollPeriodDto,
  PayrollPeriodFilter,
} from "@/dto/payroll.dto";
import type { PaginationResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const usePaginationPayrollPeriods = (
  params: PaginationDto<PayrollPeriodFilter>,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<PayrollPeriodDto>>(
        API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION,
        {
          skip: params.skip,
          take: params.take,
          where: params.where,
        },
      ),
  });

  return {
    data: data?.content || [],
    total: data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};
