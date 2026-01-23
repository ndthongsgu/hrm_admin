import type { PaginationDto } from "@/dto/base.dto";
import type { SuccessResponse } from "@/dto/pagination.dto";
import type { RoleCreateDto, RoleUpdateDto, RoleDto } from "@/dto/role.dto";
import API_ENDPOINTS from "@/services/api-route";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationRole = (params: PaginationDto<object>) => {
  const page = Math.floor(params.skip / params.take);
  const size = params.take;

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ROLE.PAGINATION, page, size],
    queryFn: async () => {
      // Backend: GET /api/roles?page=0&size=20 -> BaseResponse<PageResponse<Role>>
      const res = await rootApiService.get<{
        success: boolean;
        data: { items: RoleDto[]; totalElements: number; page: number; size: number };
      }>(`${API_ENDPOINTS.ROLE.PAGINATION}?page=${page}&size=${size}`);
      return res.data;
    },
  });

  return {
    data: data?.items || [],
    total: data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useAllRoles = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ROLE.LIST_ALL],
    queryFn: () => rootApiService.get<RoleDto[]>(API_ENDPOINTS.ROLE.LIST_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};

export const useRoleDetail = (id: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ROLE.DETAIL(id)],
    queryFn: () => rootApiService.get<RoleDto>(API_ENDPOINTS.ROLE.DETAIL(id)),
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onCreateRole, isPending: isLoading } = useMutation({
    mutationFn: (body: RoleCreateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.ROLE.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.LIST_ALL],
      });
      showToast({
        title: "Thành công!",
        message: res.message || "Tạo vai trò thành công!",
        type: "success",
      });
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        message: error?.message || "Tạo vai trò thất bại!",
        type: "error",
      });
    },
  });

  return { onCreateRole, isLoading };
};

export const useUpdateRole = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.ROLE.UPDATE(id);
  const showToast = useToast();
  const { mutateAsync: onUpdateRole, isPending: isLoading } = useMutation({
    mutationFn: (body: RoleUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.LIST_ALL],
      });
      showToast({
        title: "Thành công!",
        message: res.message || "Cập nhật vai trò thành công!",
        type: "success",
      });
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        message: error?.message || "Cập nhật vai trò thất bại!",
        type: "error",
      });
    },
  });

  return { onUpdateRole, isLoading };
};

export const useSelectBoxRoles = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["roles_select_box"],
    queryFn: async () => {
      const res = await rootApiService.get<{
        success: boolean;
        data: { items: RoleDto[] };
      }>(`${API_ENDPOINTS.ROLE.LIST_ALL}?page=0&size=1000`);
      return res.data.items || [];
    },
  });

  return { data, isLoading, refetch };
};

// Note: Backend currently does not implement activate/deactivate endpoints for roles.
