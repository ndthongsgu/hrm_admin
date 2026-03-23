import type { PaginationDto } from "@/dto/base.dto";
import type {
  DependentCreateDto,
  DependentDto,
  DependentFilter,
  DependentUpdateDto,
} from "@/dto/dependent.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useToast } from "@/hooks/layout/useToast";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationDependent = (
  params: PaginationDto<DependentFilter>,
  enabled = true
) => {
  const employeeId = params.where?.employeeId;
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.DEPENDENT.PAGINATION, params],
    queryFn: () =>
      rootApiService.get<PaginationResponse<DependentDto>>(
        API_ENDPOINTS.DEPENDENT.BY_EMPLOYEE(employeeId || ""),
        {
          page: Math.floor(params.skip / params.take),
          size: params.take,
        }
      ),
    enabled: enabled && !!employeeId,
  });

  // Client-side filtering
  const filteredData = (data?.items || data?.content || []).filter((item) => {
    if (params.where?.fullName && !item.fullName?.toLowerCase().includes(params.where.fullName.toLowerCase())) {
      return false;
    }
    if (params.where?.relationship && !item.relationship?.toLowerCase().includes(params.where.relationship.toLowerCase())) {
      return false;
    }
    return true;
  });

  return {
    data: filteredData,
    total: data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useDetailDependent = (id: string) => {
  const url = API_ENDPOINTS.DEPENDENT.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<DependentDto>(url),
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateDependent = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();

  const { mutateAsync: onCreateDependent, isPending: isLoading } = useMutation({
    mutationFn: (body: DependentCreateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.DEPENDENT.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPENDENT.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo thân nhân thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Tạo thân nhân thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onCreateDependent, isLoading };
};

export const useUpdateDependent = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.DEPENDENT.UPDATE(id);
  const router = useRouter();
  const showToast = useToast();

  const { mutateAsync: onUpdateDependent, isPending: isLoading } = useMutation({
    mutationFn: (body: DependentUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPENDENT.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPENDENT.FIND_BY_ID(id)],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật thân nhân thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Cập nhật thân nhân thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onUpdateDependent, isLoading };
};
