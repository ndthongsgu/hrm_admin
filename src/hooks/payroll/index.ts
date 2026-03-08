import type { PaginationDto } from "@/dto/base.dto";
import type {
  PayrollPeriodDto,
  PayrollPeriodFilter,
  AttendanceSummaryDto,
  SalaryAdjustmentDto,
  SalaryAdjustmentFilter,
  PayslipDto,
  PayslipFilter,
  SelectOptionDto,
} from "@/dto/payroll.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

// ===== PAYROLL PERIOD HOOKS =====

export const usePaginationPayrollPeriods = (
  params: PaginationDto<PayrollPeriodFilter>,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<PayrollPeriodDto>>(
        API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION,
        {
          skip: params.skip,
          take: params.take,
          where: params.where,
        },
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

export const useDetailPayrollPeriod = (id: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(id)],
    queryFn: () =>
      rootApiService.get<PayrollPeriodDto>(
        API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(id),
      ),
    enabled: !!id,
  });

  if (data) {
    data.dateRange =
      data.startDate && data.endDate
        ? [data.startDate, data.endDate]
        : undefined;
  }

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreatePayrollPeriod = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();

  const { mutateAsync: onCreatePayrollPeriod, isPending: isLoading } =
    useMutation({
      mutationFn: (body: PayrollPeriodDto) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.PAYROLL_PERIOD.CREATE,
          body,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tạo kỳ lương thành công!",
          title: "Thành công",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tạo kỳ lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onCreatePayrollPeriod, isLoading };
};

export const useUpdatePayrollPeriod = (id: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();

  const { mutateAsync: onUpdatePayrollPeriod, isPending: isLoading } =
    useMutation({
      mutationFn: (body: PayrollPeriodDto) =>
        rootApiService.put<SuccessResponse>(
          API_ENDPOINTS.PAYROLL_PERIOD.UPDATE(id),
          body,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật kỳ lương thành công!",
          title: "Thành công",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Cập nhật kỳ lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onUpdatePayrollPeriod, isLoading };
};

export const useSummarizeAttendance = (payrollPeriodId: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onSummarizeAttendance, isPending: isLoading } =
    useMutation({
      mutationFn: () =>
        rootApiService.post<SuccessResponse>(
          `${API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(payrollPeriodId)}/summarize-attendance`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.ATTENDANCE_SUMMARY.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tổng hợp công thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tổng hợp công thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onSummarizeAttendance, isLoading };
};

export const useCalculatePayslips = (payrollPeriodId: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onCalculatePayslips, isPending: isLoading } =
    useMutation({
      mutationFn: () =>
        rootApiService.post<SuccessResponse>(
          `${API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(payrollPeriodId)}/calculate-payslips`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYSLIP.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tính lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tính lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onCalculatePayslips, isLoading };
};

export const useLockPayrollPeriod = (payrollPeriodId: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onLockPayrollPeriod, isPending: isLoading } =
    useMutation({
      mutationFn: () =>
        rootApiService.post<SuccessResponse>(
          `${API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(payrollPeriodId)}/lock`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Chốt kỳ lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Chốt kỳ lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onLockPayrollPeriod, isLoading };
};

export const useDeactivatePayrollPeriod = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeactivatePayrollPeriod, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.delete<SuccessResponse>(
          API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(id),
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Ngừng hoạt động kỳ lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Ngừng hoạt động kỳ lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onDeactivatePayrollPeriod, isLoading };
};

export const useActivatePayrollPeriod = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivatePayrollPeriod, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.put<SuccessResponse>(
          `${API_ENDPOINTS.PAYROLL_PERIOD.FIND_BY_ID(id)}/activate`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt lại kỳ lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Kích hoạt lại kỳ lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onActivatePayrollPeriod, isLoading };
};

// ===== ATTENDANCE SUMMARY HOOKS =====

export const usePaginationAttendanceSummaries = (
  params: PaginationDto<Record<string, any>>,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ATTENDANCE_SUMMARY.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<AttendanceSummaryDto>>(
        API_ENDPOINTS.ATTENDANCE_SUMMARY.PAGINATION,
        {
          page: Math.floor(params.skip / params.take),
          size: params.take,
          sortBy: params.sortBy || "createdAt",
          sortDirection: params.sortDirection || "DESC",
          ...params.where,
        },
      ),
  });

  const mappedData = (data?.content || []).map((item: any) => ({
    ...item,
    employeeId: item.employee?.id || item.employeeId,
    employeeName: item.employee?.fullName || item.employeeName,
    employeeCode: item.employee?.employeeCode || item.employeeCode,
    payrollPeriodId: item.payrollPeriod?.id || item.payrollPeriodId,
    payrollPeriodName: item.payrollPeriod?.name || item.payrollPeriodName,
  }));

  return {
    data: mappedData,
    total: data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useDetailAttendanceSummary = (id: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ATTENDANCE_SUMMARY.FIND_BY_ID(id)],
    queryFn: () =>
      rootApiService.get<AttendanceSummaryDto>(
        API_ENDPOINTS.ATTENDANCE_SUMMARY.FIND_BY_ID(id),
      ),
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};

export const useApproveAttendance = (attendanceSummaryId: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onApproveAttendance, isPending: isLoading } =
    useMutation({
      mutationFn: () =>
        rootApiService.post<SuccessResponse>(
          `${API_ENDPOINTS.ATTENDANCE_SUMMARY.FIND_BY_ID(attendanceSummaryId)}/approve`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.ATTENDANCE_SUMMARY.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Duyệt công thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Duyệt công thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onApproveAttendance, isLoading };
};

export const useUpdateAttendanceSummary = (id: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onUpdateAttendanceSummary, isPending: isLoading } =
    useMutation({
      mutationFn: (body: AttendanceSummaryDto) =>
        rootApiService.put<SuccessResponse>(
          API_ENDPOINTS.ATTENDANCE_SUMMARY.FIND_BY_ID(id),
          body,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.ATTENDANCE_SUMMARY.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật công thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Cập nhật công thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onUpdateAttendanceSummary, isLoading };
};

// ===== SALARY ADJUSTMENT HOOKS =====

export const usePaginationSalaryAdjustments = (
  params: PaginationDto<SalaryAdjustmentFilter>,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<SalaryAdjustmentDto>>(
        API_ENDPOINTS.SALARY_ADJUSTMENT.PAGINATION,
        {
          page: Math.floor(params.skip / params.take),
          size: params.take,
          sortBy: params.sortBy || "createdAt",
          sortDirection: params.sortDirection || "DESC",
          ...params.where,
        },
      ),
  });

  const mappedData = (data?.content || []).map((item: any) => ({
    ...item,
    employeeId: item.employee?.id || item.employeeId,
    employeeName: item.employee?.fullName || item.employeeName,
    employeeCode: item.employee?.employeeCode || item.employeeCode,
    payrollPeriodId: item.payrollPeriod?.id || item.payrollPeriodId,
    payrollPeriodName: item.payrollPeriod?.name || item.payrollPeriodName,
  }));

  return {
    data: mappedData,
    total: data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateSalaryAdjustment = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onCreateSalaryAdjustment, isPending: isLoading } =
    useMutation({
      mutationFn: (body: SalaryAdjustmentDto) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.SALARY_ADJUSTMENT.CREATE,
          body,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tạo điều chỉnh lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tạo điều chỉnh lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onCreateSalaryAdjustment, isLoading };
};

export const useDetailSalaryAdjustment = (id: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.FIND_BY_ID(id)],
    queryFn: () =>
      rootApiService.get<SalaryAdjustmentDto>(
        API_ENDPOINTS.SALARY_ADJUSTMENT.FIND_BY_ID(id),
      ),
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};

export const useUpdateSalaryAdjustment = (id: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onUpdateSalaryAdjustment, isPending: isLoading } =
    useMutation({
      mutationFn: (body: SalaryAdjustmentDto) =>
        rootApiService.put<SuccessResponse>(
          API_ENDPOINTS.SALARY_ADJUSTMENT.UPDATE(id),
          body,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật điều chỉnh lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Cập nhật điều chỉnh lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onUpdateSalaryAdjustment, isLoading };
};

export const useDeactivateSalaryAdjustment = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeactivateSalaryAdjustment, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.delete<SuccessResponse>(
          API_ENDPOINTS.SALARY_ADJUSTMENT.FIND_BY_ID(id),
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Ngừng hoạt động điều chỉnh lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Ngừng hoạt động điều chỉnh lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onDeactivateSalaryAdjustment, isLoading };
};

export const useActivateSalaryAdjustment = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateSalaryAdjustment, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.put<SuccessResponse>(
          `${API_ENDPOINTS.SALARY_ADJUSTMENT.FIND_BY_ID(id)}/activate`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SALARY_ADJUSTMENT.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt lại điều chỉnh lương thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Kích hoạt lại điều chỉnh lương thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onActivateSalaryAdjustment, isLoading };
};

// ===== PAYSLIP HOOKS =====

export const usePaginationPayslips = (params: PaginationDto<PayslipFilter>) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYSLIP.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<PayslipDto>>(
        API_ENDPOINTS.PAYSLIP.PAGINATION,
        {
          page: Math.floor(params.skip / params.take),
          size: params.take,
          sortBy: params.sortBy || "createdAt",
          sortDirection: params.sortDirection || "DESC",
          ...params.where,
        },
      ),
  });

  const mappedData = (data?.content || []).map((item: any) => ({
    ...item,
    employeeId: item.employee?.id || item.employeeId,
    employeeName: item.employee?.fullName || item.employeeName,
    employeeCode: item.employee?.employeeCode || item.employeeCode,
    payrollPeriodId: item.payrollPeriod?.id || item.payrollPeriodId,
    payrollPeriodName: item.payrollPeriod?.name || item.payrollPeriodName,
  }));

  return {
    data: mappedData,
    total: data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useDetailPayslip = (id: string) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYSLIP.FIND_BY_ID(id)],
    queryFn: () =>
      rootApiService.get<PayslipDto>(API_ENDPOINTS.PAYSLIP.FIND_BY_ID(id)),
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};

// ===== SELECTBOX OPTIONS HOOKS =====

export const usePayrollPeriodSelectOptions = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.PAYROLL_PERIOD.SELECT_OPTIONS],
    queryFn: () =>
      rootApiService.get<SelectOptionDto[]>(
        API_ENDPOINTS.PAYROLL_PERIOD.SELECT_OPTIONS,
      ),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};

export const useEmployeeSelectOptions = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.EMPLOYEE.SELECT_OPTIONS],
    queryFn: () =>
      rootApiService.get<SelectOptionDto[]>(
        API_ENDPOINTS.EMPLOYEE.SELECT_OPTIONS,
      ),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
    error,
  };
};
