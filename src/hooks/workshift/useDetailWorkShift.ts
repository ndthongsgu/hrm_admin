import type { WorkShiftDto } from "@/dto/workshift.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useDetailWorkShift = (id: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.WORK_SHIFT.FIND_BY_ID(id)],
    queryFn: () =>
      rootApiService.get<WorkShiftDto>(
        API_ENDPOINTS.WORK_SHIFT.FIND_BY_ID(id),
      ),
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};
