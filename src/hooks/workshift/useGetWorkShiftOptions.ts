import type { SelectOptionDto } from "@/dto/workshift.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkShiftOptions = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.WORK_SHIFT.SELECT_OPTIONS],
    queryFn: () =>
      rootApiService.get<SelectOptionDto[]>(
        API_ENDPOINTS.WORK_SHIFT.SELECT_OPTIONS,
      ),
  });

  return {
    options: data || [],
    isLoading,
    refetch,
    error,
  };
};
