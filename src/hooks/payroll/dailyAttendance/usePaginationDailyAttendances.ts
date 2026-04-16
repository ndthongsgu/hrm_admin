import type { PaginationDto } from "@/dto/base.dto";
import type {
  DailyAttendanceDto,
  DailyAttendanceFilter,
} from "@/dto/payroll.dto";
import type { PaginationResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const usePaginationDailyAttendances = (
  params: PaginationDto<DailyAttendanceFilter>,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.DAILY_ATTENDANCE.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<DailyAttendanceDto>>(
        API_ENDPOINTS.DAILY_ATTENDANCE.PAGINATION,
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