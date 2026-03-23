import type { PaginationDto } from "@/dto/base.dto";
import type {
  EmployeeCreateDto,
  EmployeeDto,
  EmployeeFilter,
  EmployeeUpdateDto,
} from "@/dto/employee.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import employeeService from "@/services/employee.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useUploadKnownFaces = () => {
  const router = useRouter();
  const showToast = useToast();
  const queryClient = useQueryClient();

  const { mutate: upload, isPending } = useMutation({
    mutationFn: ({ employeeId, files }: { employeeId: string; files: File[] }) =>
      employeeService.uploadKnownFaces(employeeId, files),
    onSuccess: (response: any) => {
      showToast({
        type: "success",
        title: "Thành công",
        message: response?.data?.message || "Upload ảnh nhân viên thành công",
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION],
      });
      router.back();
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi upload ảnh";
      showToast({
        type: "error",
        title: "Lỗi",
        message: errorMsg,
      });
    },
  });

  return {
    upload,
    isPending,
  };
};

const normalizeEmployee = (employee: any): EmployeeDto => {
  const firstContract = employee?.contracts?.[0];

  return {
    ...employee,
    code: employee?.code || employee?.employeeCode,
    employeeCode: employee?.employeeCode || employee?.code || "",
    phoneNumber: employee?.phoneNumber || employee?.phone,
    departmentId: employee?.departmentId || employee?.department?.id,
    departmentName: employee?.departmentName || employee?.department?.name,
    positionId:
      employee?.positionId || employee?.position?.id || firstContract?.position?.id,
    positionName:
      employee?.positionName ||
      employee?.position?.name ||
      firstContract?.position?.name,
    hireDate: employee?.hireDate || firstContract?.startDate,
    terminationDate: employee?.terminationDate || firstContract?.endDate,
    isActive:
      typeof employee?.isActive === "boolean"
        ? employee.isActive
        : employee?.status === "ACTIVE",
  } as EmployeeDto;
};

const normalizeEmployeeFilter = (
  filter?: EmployeeFilter
): EmployeeFilter | undefined => {
  if (!filter) return filter;

  return {
    ...filter,
    employeeCode: filter.employeeCode || filter.code,
    phone: filter.phone || filter.phoneNumber,
    status:
      filter.status ||
      (typeof filter.isActive === "boolean"
        ? filter.isActive
          ? "ACTIVE"
          : "DEACTIVE"
        : undefined),
  };
};

export const usePaginationEmployee = (
  params: PaginationDto<EmployeeFilter>
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<EmployeeDto>>(
        API_ENDPOINTS.EMPLOYEE.PAGINATION,
        {
          skip: params.skip,
          take: params.take,
          where: normalizeEmployeeFilter(params.where),
        }
      ),
  });

  return {
    data: (data?.content || []).map(normalizeEmployee),
    total: data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useAllEmployees = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.EMPLOYEE.GET_ALL],
    queryFn: () =>
      rootApiService.get<EmployeeDto[]>(API_ENDPOINTS.EMPLOYEE.GET_ALL),
  });

  return {
    data: (data || []).map(normalizeEmployee),
    isLoading,
    refetch,
  };
};
export const useDetailEmployee = (id: string) => {
  const url = API_ENDPOINTS.EMPLOYEE.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<EmployeeDto>(url),
    enabled: !!id,
  });

  return {
    data: data ? normalizeEmployee(data) : undefined,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateEmployee, isPending: isLoading } = useMutation({
    mutationFn: (body: EmployeeCreateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.EMPLOYEE.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo nhân viên thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Tạo nhân viên thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onCreateEmployee, isLoading };
};

export const useUpdateEmployee = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.EMPLOYEE.UPDATE(id);
  const router = useRouter();
  const showToast = useToast();
  const { mutateAsync: onUpdateEmployee, isPending: isLoading } = useMutation({
    mutationFn: (body: EmployeeUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.EMPLOYEE.FIND_BY_ID(id)],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật nhân viên thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Cập nhật nhân viên thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onUpdateEmployee, isLoading };
};

export const useDeActivateEmployee = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateEmployee, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<EmployeeDto>>(
          API_ENDPOINTS.EMPLOYEE.DEACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Ngưng hoạt động nhân viên thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Ngưng hoạt động nhân viên thất bại!",
        });
      },
    });

  return { onDeActivateEmployee, isLoading };
};

// Active
export const useActivateEmployee = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateEmployee, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<EmployeeDto>>(
          API_ENDPOINTS.EMPLOYEE.ACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Kích hoạt nhân viên thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Kích hoạt nhân viên thất bại!",
        });
      },
    }
  );

  return { onActivateEmployee, isLoading };
};
