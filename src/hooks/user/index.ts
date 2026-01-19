import type { PaginationDto } from "@/dto/base.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import type {
  UserCreateUpdateDto,
  UserDto,
  UserFilter,
  UserPageRequest,
  UserSelectDto,
} from "@/dto/user.dto";
import API_ENDPOINTS from "@/services/api-route";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useGetAllUsers = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.USER.GET_ALL],
    queryFn: () => rootApiService.get<UserDto[]>(API_ENDPOINTS.USER.GET_ALL),
  });

  return {
    data: data ?? [],
    isLoading,
    refetch,
    error,
  };
};

export const usePaginationUser = (params: PaginationDto<UserFilter>) => {
  const requestParams: UserPageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: params.sortBy || "createdDate",
    sortDirection: params.sortDirection || "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.USER.PAGINATION, requestParams],
    queryFn: () =>
      rootApiService.get<PaginationResponse<UserDto>>(
        API_ENDPOINTS.USER.PAGINATION,
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

export const useDetailUser = (id: number) => {
  const url = API_ENDPOINTS.USER.FIND_BY_ID(id.toString());
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<UserDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onCreateUser, isPending: isLoading } = useMutation({
    mutationFn: (body: UserCreateUpdateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.USER.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USER.PAGINATION],
      });
      showToast({
        title: "Thành công!",
        message: res.message || "Tạo người dùng thành công!",
        type: "success",
      });
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        message: error?.message || "Tạo người dùng thất bại!",
        type: "error",
      });
    },
  });

  return { onCreateUser, isLoading };
};

export const useUpdateUser = (id: number) => {
  const queryClient = useQueryClient();

  const showToast = useToast();
  const url = API_ENDPOINTS.USER.UPDATE(id.toString());

  const { mutateAsync: onUpdateUser, isPending: isLoading } = useMutation({
    mutationFn: (body: UserCreateUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USER.FIND_BY_ID(id.toString())],
      });
      showToast({
        title: "Thành công!",
        message: res.message || "Cập nhật người dùng thành công!",
        type: "success",
      });
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        message: error?.message || "Cập nhật người dùng thất bại!",
        type: "error",
      });
    },
  });

  return { onUpdateUser, isLoading };
};

export const useUserSelect = (searchTerm?: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.USER.SELECT, searchTerm],
    queryFn: () =>
      rootApiService.get<UserSelectDto[]>(
        API_ENDPOINTS.USER.SELECT,
        searchTerm ? { search: searchTerm } : {}
      ),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};

export const useDeActivateUser = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateUser, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<UserDto>>(
        API_ENDPOINTS.USER.DEACTIVATE(id)
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USER.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Ngưng hoạt động người dùng thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Ngưng hoạt động người dùng thất bại!",
      });
    },
  });

  return { onDeActivateUser, isLoading };
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateUser, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<UserDto>>(
        API_ENDPOINTS.USER.ACTIVATE(id)
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USER.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Kích hoạt người dùng thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Kích hoạt người dùng thất bại!",
      });
    },
  });

  return { onActivateUser, isLoading };
};
