import type { PaginationDto } from "@/dto/base.dto";
import type {
  CustomerTypeCreateDto,
  CustomerTypeDto,
  CustomerTypeFilter,
  CustomerTypePageRequest,
  CustomerTypeUpdateDto,
} from "@/dto/customerType.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationCustomerType = (
  params: PaginationDto<CustomerTypeFilter>
) => {
  const requestParams: CustomerTypePageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.CUSTOMER_TYPE.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<CustomerTypeDto>>(
        API_ENDPOINTS.CUSTOMER_TYPE.PAGINATION,
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

export const useAllCustomerTypes = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CUSTOMER_TYPE.GET_ALL],
    queryFn: () =>
      rootApiService.get<CustomerTypeDto[]>(
        API_ENDPOINTS.CUSTOMER_TYPE.GET_ALL
      ),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useSelectCustomerTypes = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CUSTOMER_TYPE.SELECT],
    queryFn: () =>
      rootApiService.get<CustomerTypeDto[]>(API_ENDPOINTS.CUSTOMER_TYPE.SELECT),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useDetailCustomerType = (id: string) => {
  const url = API_ENDPOINTS.CUSTOMER_TYPE.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<CustomerTypeDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};
export const useCreateCustomerType = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateCustomerType, isPending: isLoading } =
    useMutation({
      mutationFn: (body: CustomerTypeCreateDto) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.CUSTOMER_TYPE.CREATE,
          body
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER_TYPE.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tạo loại khách hàng thành công!",
          title: "Thành công",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tạo loại khách hàng thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onCreateCustomerType, isLoading };
};

export const useUpdateCustomerType = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.CUSTOMER_TYPE.UPDATE(id);
  const router = useRouter();
  const showToast = useToast();
  const { mutateAsync: onUpdateCustomerType, isPending: isLoading } =
    useMutation({
      mutationFn: (body: CustomerTypeUpdateDto) =>
        rootApiService.put<SuccessResponse>(url, body),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER_TYPE.PAGINATION],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER_TYPE.FIND_BY_ID(id)],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật loại khách hàng thành công!",
          title: "Thành công",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Cập nhật loại khách hàng thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onUpdateCustomerType, isLoading };
};

export const useDeActivateCustomerType = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateCustomerType, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<CustomerTypeDto>>(
          API_ENDPOINTS.CUSTOMER_TYPE.DEACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER_TYPE.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Ngưng hoạt động loại khách hàng thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message:
            error?.message || "Ngưng hoạt động loại khách hàng thất bại!",
        });
      },
    });

  return { onDeActivateCustomerType, isLoading };
};

export const useActivateCustomerType = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateCustomerType, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<CustomerTypeDto>>(
          API_ENDPOINTS.CUSTOMER_TYPE.ACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER_TYPE.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Kích hoạt loại khách hàng thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Kích hoạt loại khách hàng thất bại!",
        });
      },
    });

  return { onActivateCustomerType, isLoading };
};
