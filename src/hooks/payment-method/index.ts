import type { PaginationDto } from "@/dto/base.dto";
import type {
  PaymentMethodCreateDto,
  PaymentMethodDto,
  PaymentMethodFilter,
  PaymentMethodPageRequest,
  PaymentMethodUpdateDto,
} from "@/dto/paymentMethod.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationPaymentMethod = (
  params: PaginationDto<PaymentMethodFilter>
) => {
  const requestParams: PaymentMethodPageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYMENT_METHOD.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<PaymentMethodDto>>(
        API_ENDPOINTS.PAYMENT_METHOD.PAGINATION,
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

export const useAllPaymentMethods = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.PAYMENT_METHOD.GET_ALL],
    queryFn: () =>
      rootApiService.get<PaymentMethodDto[]>(API_ENDPOINTS.PAYMENT_METHOD.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};
export const useDetailPaymentMethod = (id: string) => {
  const url = API_ENDPOINTS.PAYMENT_METHOD.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<PaymentMethodDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onCreatePaymentMethod, isPending: isLoading } = useMutation({
    mutationFn: (body: PaymentMethodCreateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.PAYMENT_METHOD.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PAYMENT_METHOD.PAGINATION],
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

  return { onCreatePaymentMethod, isLoading };
};

export const useUpdatePaymentMethod = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.PAYMENT_METHOD.UPDATE(id);
  const showToast = useToast();
  const { mutateAsync: onUpdatePaymentMethod, isPending: isLoading } = useMutation({
    mutationFn: (body: PaymentMethodUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PAYMENT_METHOD.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PAYMENT_METHOD.FIND_BY_ID(id)],
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

  return { onUpdatePaymentMethod, isLoading };
};

export const useDeActivatePaymentMethod = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivatePaymentMethod, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.patch<SuccessResponse>(
          API_ENDPOINTS.PAYMENT_METHOD.DEACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYMENT_METHOD.PAGINATION],
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

  return { onDeActivatePaymentMethod, isLoading };
};

// Active
export const useActivatePaymentMethod = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivatePaymentMethod, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.patch<SuccessResponse>(
          API_ENDPOINTS.PAYMENT_METHOD.ACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYMENT_METHOD.PAGINATION],
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

  return { onActivatePaymentMethod, isLoading };
};

export const useSelectPaymentMethods = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.PAYMENT_METHOD.SELECT],
    queryFn: () =>
      rootApiService.get<PaymentMethodDto[]>(API_ENDPOINTS.PAYMENT_METHOD.SELECT),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};
