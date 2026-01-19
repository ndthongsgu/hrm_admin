import type { PaginationDto } from "@/dto/base.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import type {
  RouteCreateUpdateDto,
  RouteDto,
  RouteFilter,
  RoutePageRequest,
} from "@/dto/route.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";

import { useRouter } from "@/routes/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useGetAllRoutes = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ROUTE.GET_ALL],
    queryFn: () => rootApiService.get<RouteDto[]>(API_ENDPOINTS.ROUTE.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};

export const useSelectRoutes = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ROUTE.SELECT],
    queryFn: () => rootApiService.get<RouteDto[]>(API_ENDPOINTS.ROUTE.SELECT),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};

export const usePaginationRoute = (params: PaginationDto<RouteFilter>) => {
  const requestParams: RoutePageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ROUTE.PAGINATION, params],
    queryFn: async () =>
      rootApiService.post<PaginationResponse<RouteDto>>(
        API_ENDPOINTS.ROUTE.PAGINATION,
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

export const useDetailRoute = (id: string) => {
  const url = API_ENDPOINTS.ROUTE.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<RouteDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateRoute, isPending: isLoading } = useMutation({
    mutationFn: (body: RouteCreateUpdateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.ROUTE.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROUTE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: ["/admin/routes", "all"],
      });
      showToast({
        title: "Thành công!",
        message: res.message || "Tạo tuyến đường thành công!",
        type: "success",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        message: error?.message || "Tạo tuyến đường thất bại!",
        type: "error",
      });
    },
  });

  return { onCreateRoute, isLoading };
};

export const useUpdateRoute = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.ROUTE.UPDATE(id);
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onUpdateRoute, isPending: isLoading } = useMutation({
    mutationFn: (body: RouteCreateUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROUTE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROUTE.FIND_BY_ID(id)],
      });
      queryClient.invalidateQueries({
        queryKey: ["/admin/routes", "all"],
      });
      showToast({
        title: "Thành công!",
        message: res.message || "Cập nhật tuyến đường thành công!",
        type: "success",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        message: error?.message || "Cập nhật tuyến đường thất bại!",
        type: "error",
      });
    },
  });

  return { onUpdateRoute, isLoading };
};

export const useAllRoutes = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/admin/routes", "all"],
    queryFn: () => rootApiService.get<RouteDto[]>("/admin/routes"),
  });

  return {
    data: data || [],
    total: 0,
    isLoading,
    refetch,
  };
};

export const useDeActivateRoute = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateRoute, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<RouteDto>>(
        API_ENDPOINTS.ROUTE.DEACTIVATE(id)
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROUTE.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Ngưng hoạt động tuyến đường thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Ngưng hoạt động tuyến đường thất bại!",
      });
    },
  });

  return { onDeActivateRoute, isLoading };
};

export const useActivateRoute = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateRoute, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<RouteDto>>(
        API_ENDPOINTS.ROUTE.ACTIVATE(id)
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROUTE.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Kích hoạt tuyến đường thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Kích hoạt tuyến đường thất bại!",
      });
    },
  });

  return { onActivateRoute, isLoading };
};
