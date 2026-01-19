import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import type {
  TripStopCreateUpdateDto,
  TripStopDto,
  TripStopPageRequest,
} from "@/dto/tripStop.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useTripStopsByTrip = (tripId: string) => {
  const requestParams: TripStopPageRequest = {
    page: 0,
    size: 500,
    sortBy: "orderIndex",
    sortDirection: "ASC",
    tripId,
  } as any;

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.TRIP_STOP.PAGINATION, requestParams],
    queryFn: () =>
      rootApiService.post<PaginationResponse<TripStopDto>>(
        API_ENDPOINTS.TRIP_STOP.PAGINATION,
        requestParams
      ),
    enabled: !!tripId,
  });

  return {
    data: data?.content || [],
    isLoading,
    refetch,
    error,
  };
};

export const useCreateTripStop = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onCreateTripStop, isPending: isLoading } = useMutation({
    mutationFn: (body: TripStopCreateUpdateDto) =>
      rootApiService.post<SuccessResponse>(
        API_ENDPOINTS.TRIP_STOP.CREATE,
        body
      ),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRIP_STOP.PAGINATION],
      });
      showToast({
        title: "Thành công!",
        message: res.message || "Thêm điểm dừng thành công!",
        type: "success",
      });
    },
    onError: (error: any) =>
      showToast({
        title: "Thất bại!",
        message: error?.message || "Thêm điểm dừng thất bại!",
        type: "error",
      }),
  });
  return { onCreateTripStop, isLoading };
};

export const useUpdateTripStop = (id: string) => {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.TRIP_STOP.UPDATE(id);
  const { mutateAsync: onUpdateTripStop, isPending: isLoading } = useMutation({
    mutationFn: (body: TripStopCreateUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRIP_STOP.PAGINATION],
      });
      showToast({
        title: "Thành công!",
        message: res.message || "Cập nhật điểm dừng thành công!",
        type: "success",
      });
    },
    onError: (error: any) =>
      showToast({
        title: "Thất bại!",
        message: error?.message || "Cập nhật điểm dừng thất bại!",
        type: "error",
      }),
  });
  return { onUpdateTripStop, isLoading };
};

export const useDeleteTripStop = () => {
  const showToast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["delete-trip-stop"],
    mutationFn: async (id: string) => {
      const url = API_ENDPOINTS.TRIP_STOP.DELETE(id);
      return await rootApiService.delete<SuccessResponse>(url);
    },
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRIP_STOP.PAGINATION],
      });
      showToast({
        title: "Thành công!",
        message: res.message || "Xóa điểm dừng thành công!",
        type: "success",
      });
    },
    onError: (error: any) => {
      showToast({
        title: "Thất bại!",
        message: error?.message || "Xóa điểm dừng thất bại!",
        type: "error",
      });
    },
  });

  return {
    onDeleteTripStop: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useDeActivateTripStop = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateTripStop, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<TripStopDto>>(
          API_ENDPOINTS.TRIP_STOP.DEACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TRIP_STOP.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Ngưng hoạt động điểm dừng thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Ngưng hoạt động điểm dừng thất bại!",
        });
      },
    });

  return { onDeActivateTripStop, isLoading };
};

export const useActivateTripStop = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateTripStop, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<TripStopDto>>(
          API_ENDPOINTS.TRIP_STOP.ACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TRIP_STOP.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Kích hoạt điểm dừng thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Kích hoạt điểm dừng thất bại!",
        });
      },
    }
  );

  return { onActivateTripStop, isLoading };
};
