import type { PaginationDto } from "@/dto/base.dto";
import type {
  CarEmployeeCreateUpdateDto,
  CarEmployeeDto,
  CarEmployeeFilter,
  CarEmployeePageRequest,
} from "@/dto/carEmployee.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationCarEmployee = (
  params: PaginationDto<CarEmployeeFilter>
) => {
  const requestParams: CarEmployeePageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.CAR_EMPLOYEE.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<CarEmployeeDto>>(
        API_ENDPOINTS.CAR_EMPLOYEE.PAGINATION,
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

export const useAllCarEmployees = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CAR_EMPLOYEE.GET_ALL],
    queryFn: () =>
      rootApiService.get<CarEmployeeDto[]>(API_ENDPOINTS.CAR_EMPLOYEE.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useCreateCarEmployee = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateCarEmployee, isPending: isLoading } =
    useMutation({
      mutationFn: (body: CarEmployeeCreateUpdateDto) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.CAR_EMPLOYEE.CREATE,
          body
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CAR_EMPLOYEE.PAGINATION],
        });
        showToast({
          title: "Thành công!",
          message: res.message || "Tạo phân công thành công!",
          type: "success",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          title: "Thất bại!",
          message: error?.message || "Tạo phân công thất bại!",
          type: "error",
        });
      },
    });

  return { onCreateCarEmployee, isLoading };
};

export const useUpdateCarEmployee = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.CAR_EMPLOYEE.UPDATE(id);
  const router = useRouter();

  const showToast = useToast();
  const { mutateAsync: onUpdateCarEmployee, isPending: isLoading } =
    useMutation({
      mutationFn: (body: CarEmployeeCreateUpdateDto) =>
        rootApiService.put<SuccessResponse>(url, body),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CAR_EMPLOYEE.PAGINATION],
        });
        showToast({
          title: "Thành công!",
          message: res.message || "Cập nhật phân công thành công!",
          type: "success",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          title: "Thất bại!",
          message: error?.message || "Cập nhật phân công thất bại!",
          type: "error",
        });
      },
    });

  return { onUpdateCarEmployee, isLoading };
};

export const useDeleteCarEmployee = () => {
  const queryClient = useQueryClient();

  const showToast = useToast();
  const { mutateAsync: onDeleteCarEmployee, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.delete<SuccessResponse>(
          API_ENDPOINTS.CAR_EMPLOYEE.DELETE(id)
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CAR_EMPLOYEE.PAGINATION],
        });
        showToast({
          title: "Thành công!",
          message: res.message || "Xóa phân công thành công!",
          type: "success",
        });
      },
      onError: (error: any) => {
        showToast({
          title: "Thất bại!",
          message: error?.message || "Xóa phân công thất bại!",
          type: "error",
        });
      },
    });

  return { onDeleteCarEmployee, isLoading };
};
