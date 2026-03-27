import type { PaginationDto } from "@/dto/base.dto";
import type { WorkShiftDto, WorkShiftFilter } from "@/dto/workshift.dto";
import type { PaginationResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const usePaginationWorkShifts = (
  params: PaginationDto<WorkShiftFilter>,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.WORK_SHIFT.SEARCH, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<WorkShiftDto>>(
        API_ENDPOINTS.WORK_SHIFT.SEARCH,
        {
          skip: params.skip,
          take: params.take,
          where: params.where,
        },
      ),
  });

  return {
    data: data?.items || data?.content || [],
    total: data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};
