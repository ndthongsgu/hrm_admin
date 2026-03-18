import type { OfficeLocationDto } from "@/dto/officeLocation.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useDetailOfficeLocation = (id?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.OFFICE_LOCATION.FIND_BY_ID(id || ""), id],
    queryFn: () =>
      rootApiService.get<OfficeLocationDto>(
        API_ENDPOINTS.OFFICE_LOCATION.FIND_BY_ID(id || ""),
      ),
    enabled: !!id,
  });

  return { data, isLoading, error };
};
