import type { PaginationDto, PaginationResponse } from "@/dto/pagination.dto";
import type { PayslipDto } from "@/dto/payroll.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const usePaginationPayslips = (params: PaginationDto<Record<string, any>>) => {
  const page = Math.floor(params.skip / params.take);

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYSLIP.PAGINATION, params],
    queryFn: () => {
      const filterPayload = Object.fromEntries(
        Object.entries(params.where || {}).filter(([, value]) => {
          if (value === undefined || value === null) {
            return false;
          }

          if (typeof value === "string") {
            return value.trim() !== "";
          }

          return true;
        }),
      );

      return rootApiService.post<PaginationResponse<PayslipDto>>(
        API_ENDPOINTS.PAYSLIP.PAGINATION,
        Object.keys(filterPayload).length > 0 ? filterPayload : undefined,
        undefined,
        {
          params: {
            page,
            size: params.take,
            sort: "createdAt,desc",
          },
        },
      );
    },
  });

  const mappedData = (data?.content || []).map((item: any) => ({
    ...item,
    employeeId: item.employee?.id || item.employeeId,
    employeeName: item.employee?.fullName || item.employeeName,
    employeeCode: item.employee?.employeeCode || item.employeeCode,
    payrollPeriodId: item.payrollPeriod?.id || item.payrollPeriodId,
    payrollPeriodName: item.payrollPeriod?.name || item.payrollPeriodName,
  }));

  return {
    data: mappedData,
    total: data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};
