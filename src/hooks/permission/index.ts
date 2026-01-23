import type { ModulePermission } from "@/dto/auth.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useGetAllPermission = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.PERMISSION.GET_ALL],
    queryFn: () =>
      rootApiService.get<ModulePermission[]>(API_ENDPOINTS.PERMISSION.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useGetPermissionByRole = (roleId: string) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.PERMISSION.GET_BY_ROLE(roleId)],
    queryFn: () =>
      rootApiService.get<ModulePermission[]>(API_ENDPOINTS.PERMISSION.GET_BY_ROLE(roleId)),
    enabled: !!roleId,
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useAssignPermissionToRole = (roleId: string) => {
  // Updated to use permissionsJson format: {"EMPLOYEE": ["READ", "CREATE"], ...}
  const assignPermissionToRole = async (permissions: Record<string, string[]>) => {
    return rootApiService.post(API_ENDPOINTS.PERMISSION.ASSIGN(roleId), permissions);
  };

  return {
    assignPermissionToRole,
  };
};