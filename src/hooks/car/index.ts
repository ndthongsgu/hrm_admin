import type { PaginationDto } from "@/dto/base.dto";
import type {
  CarCreateUpdateDto,
  CarDto,
  CarFilter,
  CarPageRequest,
} from "@/dto/car.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useGetAllCars = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.CAR.GET_ALL],
    queryFn: () => rootApiService.get<CarDto[]>(API_ENDPOINTS.CAR.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};

export const useSelectCars = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.CAR.SELECT],
    queryFn: () => rootApiService.get<CarDto[]>(API_ENDPOINTS.CAR.SELECT),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};

export const usePaginationCar = (params: PaginationDto<CarFilter>) => {
  const requestParams: CarPageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.CAR.PAGINATION, requestParams],
    queryFn: async () =>
      rootApiService.post<PaginationResponse<CarDto>>(
        API_ENDPOINTS.CAR.PAGINATION,
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

export const useDetailCar = (id: string) => {
  const url = API_ENDPOINTS.CAR.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<CarDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateCar = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateCar, isPending: isLoading } = useMutation({
    mutationFn: (body: CarCreateUpdateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.CAR.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CAR.PAGINATION],
      });
      showToast({
        title: "Thành công!",
        type: "success",
        message: res.message || "Thêm mới xe thành công.",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        type: "error",
        message: error?.message || "Thêm mới xe thất bại.",
      });
    },
  });

  return { onCreateCar, isLoading };
};

export const useUpdateCar = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.CAR.UPDATE(String(id));
  const router = useRouter();

  const showToast = useToast();
  const { mutateAsync: onUpdateCar, isPending: isLoading } = useMutation({
    mutationFn: (body: CarCreateUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CAR.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CAR.FIND_BY_ID(String(id))],
      });
      showToast({
        title: "Thành công!",
        type: "success",
        message: res.message || "Cập nhật xe thành công!",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        type: "error",
        message: error?.message || "Cập nhật xe thất bại!",
      });
    },
  });

  return { onUpdateCar, isLoading };
};

// DeActive
export const useDeActivateCar = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateCar, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<CarDto>>(
        API_ENDPOINTS.CAR.DEACTIVATE(id)
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CAR.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Ngưng hoạt động xe thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Ngưng hoạt động xe thất bại!",
      });
    },
  });

  return { onDeActivateCar, isLoading };
};

// Active
export const useActivateCar = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateCar, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<CarDto>>(
        API_ENDPOINTS.CAR.ACTIVATE(id)
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CAR.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Kích hoạt xe thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Kích hoạt xe thất bại!",
      });
    },
  });

  return { onActivateCar, isLoading };
};
