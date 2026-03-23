import type {
  AllowanceTypeDto,
  ContractAllowanceDto,
  ContractDto,
  SelectOptionDto,
} from "@/dto/contract.dto";
import type { PaginationDto } from "@/dto/pagination.dto";
import { useToast } from "@/hooks/layout/useToast";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type PagedResponse<T> = {
  content: T[];
  totalElements: number;
};

const LIST_SIZE = 200;

export const useContracts = (params: PaginationDto<Record<string, any>>) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CONTRACT.PAGINATION, params],
    queryFn: () =>
      rootApiService.get<PagedResponse<ContractDto>>(
        API_ENDPOINTS.CONTRACT.PAGINATION,
        {
          page: Math.floor(params.skip / params.take),
          size: params.take,
          ...params.where,
        },
      ),
  });

  return {
    data: data?.content || [],
    total: data?.totalElements || 0,
    isLoading,
    refetch,
  };
};

export const useAllowanceTypes = (
  params: PaginationDto<Record<string, any>>,
) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.ALLOWANCE_TYPE.PAGINATION, params],
    queryFn: () =>
      rootApiService.get<PagedResponse<AllowanceTypeDto>>(
        API_ENDPOINTS.ALLOWANCE_TYPE.PAGINATION,
        {
          page: Math.floor(params.skip / params.take),
          size: params.take,
          ...params.where,
        },
      ),
  });

  return {
    data: data?.content || [],
    total: data?.totalElements || 0,
    isLoading,
    refetch,
  };
};

export const useContractAllowances = (
  params: PaginationDto<Record<string, any>>,
) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CONTRACT_ALLOWANCE.PAGINATION, params],
    queryFn: () =>
      rootApiService.get<PagedResponse<ContractAllowanceDto>>(
        API_ENDPOINTS.CONTRACT_ALLOWANCE.PAGINATION,
        {
          page: Math.floor(params.skip / params.take),
          size: params.take,
          ...params.where,
        },
      ),
  });

  return {
    data: data?.content || [],
    total: data?.totalElements || 0,
    isLoading,
    refetch,
  };
};

export const useEmployeeOptions = () => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.EMPLOYEE.SELECT_OPTIONS, "contract-options"],
    queryFn: () =>
      rootApiService.get<SelectOptionDto[] | PagedResponse<any>>(
        API_ENDPOINTS.EMPLOYEE.SELECT_OPTIONS,
      ),
  });

  const source = Array.isArray(data) ? data : data?.content || [];
  const options: SelectOptionDto[] = source.map((item: any) => ({
    id: item.id,
    name: item.name || item.fullName || item.employeeCode || item.code || "N/A",
  }));

  return { data: options, isLoading };
};

export const usePositionOptions = () => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.POSITION.PAGINATION, "contract-options"],
    queryFn: () =>
      rootApiService.post<PagedResponse<any>>(
        API_ENDPOINTS.POSITION.PAGINATION,
        {
          skip: 0,
          take: LIST_SIZE,
          where: {},
        },
      ),
  });

  const options: SelectOptionDto[] = (data?.content || []).map((item: any) => ({
    id: item.id,
    name: item.name || item.code || "N/A",
  }));

  return { data: options, isLoading };
};

const invalidateAll = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({
    queryKey: [API_ENDPOINTS.CONTRACT.PAGINATION],
  });
  queryClient.invalidateQueries({
    queryKey: [API_ENDPOINTS.ALLOWANCE_TYPE.PAGINATION],
  });
  queryClient.invalidateQueries({
    queryKey: [API_ENDPOINTS.CONTRACT_ALLOWANCE.PAGINATION],
  });
};

export const useCreateContract = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: any) =>
      rootApiService.post<ContractDto>(API_ENDPOINTS.CONTRACT.CREATE, body),
    onSuccess: () => {
      invalidateAll(queryClient);
      toast({
        type: "success",
        title: "Thành công",
        message: "Đã tạo hợp đồng",
      });
    },
    onError: (error: any) => {
      toast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Tạo hợp đồng thất bại",
      });
    },
  });
};

export const useUpdateContract = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      rootApiService.put<ContractDto>(API_ENDPOINTS.CONTRACT.UPDATE(id), body),
    onSuccess: () => {
      invalidateAll(queryClient);
      toast({
        type: "success",
        title: "Thành công",
        message: "Đã cập nhật hợp đồng",
      });
    },
    onError: (error: any) => {
      toast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Cập nhật hợp đồng thất bại",
      });
    },
  });
};

export const useDeleteContract = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) =>
      rootApiService.delete<void>(API_ENDPOINTS.CONTRACT.DELETE(id)),
    onSuccess: () => {
      invalidateAll(queryClient);
      toast({
        type: "success",
        title: "Thành công",
        message: "Đã xóa hợp đồng",
      });
    },
    onError: (error: any) => {
      toast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Xóa hợp đồng thất bại",
      });
    },
  });
};

export const useCreateAllowanceType = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: any) =>
      rootApiService.post<AllowanceTypeDto>(
        API_ENDPOINTS.ALLOWANCE_TYPE.CREATE,
        body,
      ),
    onSuccess: () => {
      invalidateAll(queryClient);
      toast({
        type: "success",
        title: "Thành công",
        message: "Đã tạo loại phụ cấp",
      });
    },
    onError: (error: any) => {
      toast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Tạo loại phụ cấp thất bại",
      });
    },
  });
};

export const useUpdateAllowanceType = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      rootApiService.put<AllowanceTypeDto>(
        API_ENDPOINTS.ALLOWANCE_TYPE.UPDATE(id),
        body,
      ),
    onSuccess: () => {
      invalidateAll(queryClient);
      toast({
        type: "success",
        title: "Thành công",
        message: "Đã cập nhật loại phụ cấp",
      });
    },
    onError: (error: any) => {
      toast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Cập nhật loại phụ cấp thất bại",
      });
    },
  });
};

export const useDeleteAllowanceType = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) =>
      rootApiService.delete<void>(API_ENDPOINTS.ALLOWANCE_TYPE.DELETE(id)),
    onSuccess: () => {
      invalidateAll(queryClient);
      toast({
        type: "success",
        title: "Thành công",
        message: "Đã xóa loại phụ cấp",
      });
    },
    onError: (error: any) => {
      toast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Xóa loại phụ cấp thất bại",
      });
    },
  });
};

export const useCreateContractAllowance = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: any) =>
      rootApiService.post<ContractAllowanceDto>(
        API_ENDPOINTS.CONTRACT_ALLOWANCE.CREATE,
        body,
      ),
    onSuccess: () => {
      invalidateAll(queryClient);
      toast({
        type: "success",
        title: "Thành công",
        message: "Đã tạo phụ cấp theo hợp đồng",
      });
    },
    onError: (error: any) => {
      toast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Tạo phụ cấp theo hợp đồng thất bại",
      });
    },
  });
};

export const useUpdateContractAllowance = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      rootApiService.put<ContractAllowanceDto>(
        API_ENDPOINTS.CONTRACT_ALLOWANCE.UPDATE(id),
        body,
      ),
    onSuccess: () => {
      invalidateAll(queryClient);
      toast({
        type: "success",
        title: "Thành công",
        message: "Đã cập nhật phụ cấp theo hợp đồng",
      });
    },
    onError: (error: any) => {
      toast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Cập nhật phụ cấp theo hợp đồng thất bại",
      });
    },
  });
};

export const useDeleteContractAllowance = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) =>
      rootApiService.delete<void>(API_ENDPOINTS.CONTRACT_ALLOWANCE.DELETE(id)),
    onSuccess: () => {
      invalidateAll(queryClient);
      toast({
        type: "success",
        title: "Thành công",
        message: "Đã xóa phụ cấp theo hợp đồng",
      });
    },
    onError: (error: any) => {
      toast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Xóa phụ cấp theo hợp đồng thất bại",
      });
    },
  });
};
