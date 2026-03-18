import type { PaginationDto, PaginationResponse } from "@/dto/pagination.dto";
import type { OfficeLocationDto } from "@/dto/officeLocation.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const usePaginationOfficeLocations = (
  params: PaginationDto<Record<string, any>>,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.OFFICE_LOCATION.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<OfficeLocationDto>>(
        API_ENDPOINTS.OFFICE_LOCATION.PAGINATION,
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
