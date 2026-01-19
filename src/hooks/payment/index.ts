import type { PaginationDto } from "@/dto/base.dto";
import type {
  PaymentCreateDto,
  PaymentDto,
  PaymentFilter,
  PaymentPageRequest,
  PaymentUpdateDto,
  PaymentUpdateStatusDto,
} from "@/dto/payment.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationPayment = (
  params: PaginationDto<PaymentFilter>
) => {
  const requestParams: PaymentPageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYMENT.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<PaymentDto>>(
        API_ENDPOINTS.PAYMENT.PAGINATION,
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

export const useAllPayments = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.PAYMENT.GET_ALL],
    queryFn: () =>
      rootApiService.get<PaymentDto[]>(API_ENDPOINTS.PAYMENT.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};
export const useDetailPayment = (id: string) => {
  const url = API_ENDPOINTS.PAYMENT.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<PaymentDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onCreatePayment, isPending: isLoading } = useMutation({
    mutationFn: (body: PaymentCreateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.PAYMENT.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PAYMENT.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo phương thức thanh toán thành công!",
        title: "Thành công",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Tạo phương thức thanh toán thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onCreatePayment, isLoading };
};

export const useUpdatePayment = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.PAYMENT.UPDATE(id);
  const showToast = useToast();
  const { mutateAsync: onUpdatePayment, isPending: isLoading } = useMutation({
    mutationFn: (body: PaymentUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PAYMENT.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PAYMENT.FIND_BY_ID(id)],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật phương thức thanh toán thành công!",
        title: "Thành công",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Cập nhật phương thức thanh toán thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onUpdatePayment, isLoading };
};

export const useDeActivatePayment = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivatePayment, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<PaymentDto>>(
          API_ENDPOINTS.PAYMENT.DEACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYMENT.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Ngưng hoạt động phương thức thanh toán thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Ngưng hoạt động phương thức thanh toán thất bại!",
        });
      },
    });

  return { onDeActivatePayment, isLoading };
};

// Active
export const useActivatePayment = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivatePayment, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<PaymentDto>>(
          API_ENDPOINTS.PAYMENT.ACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYMENT.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Kích hoạt phương thức thanh toán thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Kích hoạt phương thức thanh toán thất bại!",
        });
      },
    }
  );

  return { onActivatePayment, isLoading };
};

// Update Payment Status
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onUpdatePaymentStatus, isPending: isLoading } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentUpdateStatusDto }) =>
      rootApiService.put<SuccessResponse>(
        API_ENDPOINTS.PAYMENT.UPDATE(id),
        status
      ),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PAYMENT.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật trạng thái thanh toán thành công!",
        title: "Thành công",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Cập nhật trạng thái thanh toán thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onUpdatePaymentStatus, isLoading };
};
