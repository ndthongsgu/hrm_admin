import type { PaginationDto } from "@/dto/base.dto";

import type {
  CustomerCreateDto,
  CustomerDto,
  CustomerFilter,
  CustomerPageRequest,
  CustomerSelectOption,
  CustomerUpdateDto,
} from "@/dto/customer.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationCustomer = (
  params: PaginationDto<CustomerFilter>
) => {
  const requestParams: CustomerPageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<CustomerDto>>(
        API_ENDPOINTS.CUSTOMER.PAGINATION,
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

export const useAllCustomers = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CUSTOMER.GET_ALL],
    queryFn: () =>
      rootApiService.get<CustomerDto[]>(API_ENDPOINTS.CUSTOMER.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useSelectCustomers = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CUSTOMER.SELECT],
    queryFn: () =>
      rootApiService.get<CustomerSelectOption[]>(API_ENDPOINTS.CUSTOMER.SELECT),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useDetailCustomer = (id: string) => {
  const url = API_ENDPOINTS.CUSTOMER.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<CustomerDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateCustomer, isPending: isLoading } = useMutation({
    mutationFn: (body: CustomerCreateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.CUSTOMER.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo khách hàng thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Tạo khách hàng thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onCreateCustomer, isLoading };
};

export const useUpdateCustomer = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.CUSTOMER.UPDATE(id);
  const router = useRouter();
  const showToast = useToast();
  const { mutateAsync: onUpdateCustomer, isPending: isLoading } = useMutation({
    mutationFn: (body: CustomerUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CUSTOMER.FIND_BY_ID(id)],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật khách hàng thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Cập nhật khách hàng thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onUpdateCustomer, isLoading };
};

export const useDeActivateCustomer = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateCustomer, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<CustomerDto>>(
          API_ENDPOINTS.CUSTOMER.DEACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Ngưng hoạt động khách hàng thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Ngưng hoạt động khách hàng thất bại!",
        });
      },
    });

  return { onDeActivateCustomer, isLoading };
};

export const useActivateCustomer = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateCustomer, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<CustomerDto>>(
          API_ENDPOINTS.CUSTOMER.ACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Kích hoạt khách hàng thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Kích hoạt khách hàng thất bại!",
        });
      },
    }
  );

  return { onActivateCustomer, isLoading };
};
