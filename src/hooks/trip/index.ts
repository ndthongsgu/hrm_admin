import type { PaginationDto } from "@/dto/base.dto";
import type { PaginationResponse } from "@/dto/pagination.dto";
import type {
  TripCreateUpdateDto,
  TripDto,
  TripFilter,
  TripPageRequest,
  TripSelectDto,
} from "@/dto/trip.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useGetAllTrips = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.TRIP.GET_ALL],
    queryFn: () => rootApiService.get<TripDto[]>(API_ENDPOINTS.TRIP.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};

export const useSelectTrips = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.TRIP.SELECT],
    queryFn: () =>
      rootApiService.get<TripSelectDto[]>(API_ENDPOINTS.TRIP.SELECT),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};

export const usePaginationTrip = (params: PaginationDto<TripFilter>) => {
  const requestParams: TripPageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.TRIP.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<TripDto>>(
        API_ENDPOINTS.TRIP.PAGINATION,
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

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateTrip, isPending: isLoading } = useMutation({
    mutationFn: (body: TripCreateUpdateDto) =>
      rootApiService.post(API_ENDPOINTS.TRIP.CREATE, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRIP.PAGINATION],
      });
      showToast({
        title: "Thành công!",
        message: "Tạo chuyến chuyến đi thành công!",
        type: "success",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        message: error?.message || "Tạo chuyến chuyến đi thất bại!",
        type: "error",
      });
    },
  });
  return { onCreateTrip, isLoading };
};

export const useUpdateTrip = (id: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onUpdateTrip, isPending: isLoading } = useMutation({
    mutationFn: (body: TripCreateUpdateDto) =>
      rootApiService.post(API_ENDPOINTS.TRIP.UPDATE(id), body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRIP.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRIP.FIND_BY_ID(id)],
      });
      showToast({
        title: "Thành công!",
        message: "Cập nhật chuyến chuyến đi thành công!",
        type: "success",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        message: error?.message || "Cập nhật chuyến chuyến đi thất bại!",
        type: "error",
      });
    },
  });
  return { onUpdateTrip, isLoading };
};

export const useTripSelect = (searchTerm?: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.TRIP.SELECT, searchTerm],
    queryFn: () =>
      rootApiService.get<TripSelectDto[]>(
        API_ENDPOINTS.TRIP.SELECT,
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

export const useDetailTrip = (id: string) => {
  const url = API_ENDPOINTS.TRIP.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<TripDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useDeActivateTrip = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateTrip, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<TripDto>>(
        API_ENDPOINTS.TRIP.DEACTIVATE(id)
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRIP.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Ngưng hoạt động chuyến đi thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Ngưng hoạt động chuyến đi thất bại!",
      });
    },
  });

  return { onDeActivateTrip, isLoading };
};

// Active
export const useActivateTrip = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateTrip, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<TripDto>>(
        API_ENDPOINTS.TRIP.ACTIVATE(id)
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRIP.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Kích hoạt chuyến đi thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Kích hoạt chuyến đi thất bại!",
      });
    },
  });

  return { onActivateTrip, isLoading };
};
