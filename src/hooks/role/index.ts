import type { PaginationDto } from "@/dto/base.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import type { RoleCreateUpdateDto, RoleDto } from "@/dto/role.dto";
import API_ENDPOINTS from "@/services/api-route";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationRole = (params: PaginationDto<object>) => {
  const requestParams = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: params.sortBy || "createdDate",
    sortDirection: params.sortDirection || "ASC",
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ROLE.PAGINATION, requestParams],
    queryFn: () =>
      rootApiService.post<PaginationResponse<RoleDto>>(
        API_ENDPOINTS.ROLE.PAGINATION,
        requestParams
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
    mutationFn: (body: RoleCreateUpdateDto) =>
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
  const url = API_ENDPOINTS.ROLE.UPDATE(id.toString());
  const showToast = useToast();
  const { mutateAsync: onUpdateRole, isPending: isLoading } = useMutation({
    mutationFn: (body: RoleCreateUpdateDto) =>
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
    queryKey: [API_ENDPOINTS.ROLE.SELECT],
    queryFn: () => rootApiService.get<RoleDto[]>(API_ENDPOINTS.ROLE.SELECT),
  });

  return { data, isLoading, refetch };
};

export const useDeActivateRole = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateRole, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<RoleDto>>(
        API_ENDPOINTS.ROLE.DEACTIVATE(id)
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Ngưng hoạt động vai trò thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Ngưng hoạt động vai trò thất bại!",
      });
    },
  });

  return { onDeActivateRole, isLoading };
};

// Active
export const useActivateRole = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateRole, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<RoleDto>>(
        API_ENDPOINTS.ROLE.ACTIVATE(id)
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Kích hoạt vai trò thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Kích hoạt vai trò thất bại!",
      });
    },
  });

  return { onActivateRole, isLoading };
};
