import type { PaginationDto } from "@/dto/base.dto";
import type {
  PositionCreateDto,
  PositionDto,
  PositionFilter,
  PositionPageRequest,
  PositionUpdateDto,
  PositionSelectDto,
} from "@/dto/position.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationPosition = (
  params: PaginationDto<PositionFilter>
) => {
  const requestParams: PositionPageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: params.sortBy || "createdDate",
    sortDirection: params.sortDirection || "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.POSITION.PAGINATION, params],
    queryFn: () =>
      rootApiService.get<PaginationResponse<PositionDto>>(
        `${API_ENDPOINTS.POSITION.PAGINATION}?${new URLSearchParams(
          Object.entries(requestParams).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        )}`
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

export const useAllPositions = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.POSITION.GET_ALL],
    queryFn: () =>
      rootApiService.get<PositionDto[]>(API_ENDPOINTS.POSITION.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useDetailPosition = (id: string) => {
  const url = API_ENDPOINTS.POSITION.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<PositionDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreatePosition = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreatePosition, isPending: isLoading } = useMutation({
    mutationFn: (body: PositionCreateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.POSITION.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION.SELECT],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo chức vụ thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Tạo chức vụ thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onCreatePosition, isLoading };
};

export const useUpdatePosition = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.POSITION.UPDATE(id);
  const router = useRouter();
  const showToast = useToast();
  const { mutateAsync: onUpdatePosition, isPending: isLoading } = useMutation({
    mutationFn: (body: PositionUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION.FIND_BY_ID(id)],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSITION.SELECT],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật chức vụ thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Cập nhật chức vụ thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onUpdatePosition, isLoading };
};

export const useDeActivatePosition = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivatePosition, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.put<PaginationResponse<PositionDto>>(
          API_ENDPOINTS.POSITION.DEACTIVATE(id), {}
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.POSITION.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Ngưng hoạt động chức vụ thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Ngưng hoạt động chức vụ thất bại!",
        });
      },
    });

  return { onDeActivatePosition, isLoading };
};

export const useActivatePosition = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivatePosition, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.put<PaginationResponse<PositionDto>>(
          API_ENDPOINTS.POSITION.ACTIVATE(id), {}
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.POSITION.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Kích hoạt chức vụ thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Kích hoạt chức vụ thất bại!",
        });
      },
    }
  );

  return { onActivatePosition, isLoading };
};

export const useSelectBoxPositions = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.POSITION.SELECT],
    queryFn: () =>
      rootApiService.get<PositionSelectDto[]>(API_ENDPOINTS.POSITION.SELECT),
  });

  return { data: data || [], isLoading, refetch };
};
