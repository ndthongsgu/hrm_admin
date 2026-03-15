
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useEmployeeSelectOptions = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.EMPLOYEE.SELECT_OPTIONS],
    queryFn: () =>
      rootApiService.get<any>(
        API_ENDPOINTS.EMPLOYEE.SELECT_OPTIONS,
      ),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};
