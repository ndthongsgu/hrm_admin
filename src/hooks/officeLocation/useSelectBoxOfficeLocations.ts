import type { SelectOptionDto } from "@/dto/payroll.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useSelectBoxOfficeLocations = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.OFFICE_LOCATION.SELECT],
    queryFn: () =>
      rootApiService.get<SelectOptionDto[]>(API_ENDPOINTS.OFFICE_LOCATION.SELECT),
  });

  return { data: data || [], isLoading, refetch };
};
