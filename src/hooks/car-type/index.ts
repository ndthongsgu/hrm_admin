import type { PaginationDto } from "@/dto/base.dto";
import type {
  CarTypeCreateUpdateDto,
  CarTypeDto,
  CarTypeFilter,
  CarTypePageRequest,
} from "@/dto/carType.dto";
import type { PaginationResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationCarType = (params: PaginationDto<CarTypeFilter>) => {
  const requestParams: CarTypePageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.CAR_TYPE.PAGINATION, params],
    queryFn: async () =>
      rootApiService.post<PaginationResponse<CarTypeDto>>(
        API_ENDPOINTS.CAR_TYPE.PAGINATION,
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

export const useAllCarTypes = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CAR_TYPE.GET_ALL],
    queryFn: () =>
      rootApiService.get<CarTypeDto[]>(API_ENDPOINTS.CAR_TYPE.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useSelectCarTypes = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CAR_TYPE.SELECT],
    queryFn: () =>
      rootApiService.get<CarTypeDto[]>(API_ENDPOINTS.CAR_TYPE.SELECT),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useDetailCarType = (id: string) => {
  const url = API_ENDPOINTS.CAR_TYPE.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<CarTypeDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateCarType = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateCarType, isPending: isLoading } = useMutation({
    mutationFn: (body: CarTypeCreateUpdateDto) =>
      rootApiService.post<CarTypeDto>(API_ENDPOINTS.CAR_TYPE.CREATE, body),
    onSuccess: (_res: CarTypeDto) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CAR_TYPE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CAR_TYPE.GET_ALL],
      });
      showToast({
        title: "Thành công",
        type: "success",
        message: "Tạo loại xe thành công!",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        message: error?.message || "Tạo loại xe thất bại!",
        type: "error",
      });
    },
  });

  return { onCreateCarType, isLoading };
};

export const useUpdateCarType = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.CAR_TYPE.UPDATE(id);
  const showToast = useToast();

  const router = useRouter();
  const { mutateAsync: onUpdateCarType, isPending: isLoading } = useMutation({
    mutationFn: (body: CarTypeCreateUpdateDto) =>
      rootApiService.put<CarTypeDto>(url, body),
    onSuccess: (_res: CarTypeDto) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CAR_TYPE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CAR_TYPE.GET_ALL],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CAR_TYPE.FIND_BY_ID(id)],
      });
      showToast({
        title: "Thành công!",
        message: "Cập nhật loại xe thành công!",
        type: "success",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        message: error?.message || "Cập nhật loại xe thất bại!",
        type: "error",
      });
    },
  });

  return { onUpdateCarType, isLoading };
};

export const useDeActivateCarType = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateCarType, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<CarTypeDto>>(
          API_ENDPOINTS.CAR_TYPE.DEACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CAR_TYPE.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Ngưng hoạt động loại xe thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Ngưng hoạt động loại xe thất bại!",
        });
      },
    });

  return { onDeActivateCarType, isLoading };
};

// Active
export const useActivateCarType = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateCarType, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<CarTypeDto>>(
        API_ENDPOINTS.CAR_TYPE.ACTIVATE(id)
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CAR_TYPE.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Kích hoạt loại xe thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Kích hoạt loại xe thất bại!",
      });
    },
  });

  return { onActivateCarType, isLoading };
};
