import type { PaginationDto } from "@/dto/base.dto";
import type { EmployeeShiftAssignmentDto, EmployeeShiftAssignmentFilter } from "@/dto/employeeShiftAssignment.dto";
import type { PaginationResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { ROUTES } from "@/common/constants/routes";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/layout/useToast";

export const useGetEmployeeSelectOptions = async () => {
  return rootApiService.get<any[]>(API_ENDPOINTS.EMPLOYEE.SELECT_OPTIONS);
};

export const useGetShiftSelectOptions = async () => {
  return rootApiService.get<any[]>(API_ENDPOINTS.WORK_SHIFT.SELECT_OPTIONS);
};

export const usePaginationEmployeeShiftAssignments = (
  params: PaginationDto<EmployeeShiftAssignmentFilter>
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["employeeShiftAssignments", params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<EmployeeShiftAssignmentDto>>(
        `${API_ENDPOINTS.SHIFT_ASSIGNMENT.PAGINATION}/search`,
        {
          skip: params.skip,
          take: params.take,
          where: params.where,
        }
      ),
  });

  return {
    data: data?.content || [],
    total: data?.totalElements || 0,
    isLoading,
    error,
  };
};

export const useDetailEmployeeShiftAssignment = (id: string) => {
  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ["employeeShiftAssignment", id],
    queryFn: () =>
      rootApiService.get<EmployeeShiftAssignmentDto>(
        `${API_ENDPOINTS.SHIFT_ASSIGNMENT.FIND_BY_ID(id)}`
      ),
    enabled: !!id,
  });

  const data = rawData
    ? {
        ...rawData,
        employeeId: rawData.employee?.id || "",
        employeeName: rawData.employee?.fullName || "",
        employeeCode: rawData.employee?.employeeCode || "",
        shiftId: rawData.shift?.id || "",
        shiftName: rawData.shift?.name || "",
      }
    : undefined;


  return {
    data,
    isLoading,
    error,
  };
};

export const useCreateEmployeeShiftAssignment = () => {
  const router = useRouter();
  const showToast = useToast();
  const queryClient = useQueryClient();

  const { mutate: create, isPending } = useMutation({
    mutationFn: (data: any) =>
      rootApiService.post<EmployeeShiftAssignmentDto>(
        API_ENDPOINTS.SHIFT_ASSIGNMENT.CREATE,
        data
      ),
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Thành công",
        message: "Thêm gán ca làm việc thành công",
      });
      queryClient.invalidateQueries({
        queryKey: ["employeeShiftAssignments"],
      });
      router.push(ROUTES.MAIN.PAYROLL_MANAGER.children.EMPLOYEE_SHIFT_ASSIGNMENTS.path);
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message || "Có lỗi xảy ra khi tạo gán ca làm việc";
      showToast({
        type: "error",
        title: "Lỗi",
        message: errorMsg,
      });
    },
  });

  return {
    onCreateEmployeeShiftAssignment: create,
    isLoading: isPending,
  };
};

export const useUpdateEmployeeShiftAssignment = (id: string) => {
  const router = useRouter();
  const showToast = useToast();
  const queryClient = useQueryClient();

  const { mutate: update, isPending } = useMutation({
    mutationFn: (data: any) =>
      rootApiService.put<EmployeeShiftAssignmentDto>(
        API_ENDPOINTS.SHIFT_ASSIGNMENT.UPDATE(id),
        data
      ),
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Thành công",
        message: "Cập nhật gán ca làm việc thành công",
      });
      queryClient.invalidateQueries({
        queryKey: ["employeeShiftAssignments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["employeeShiftAssignment", id],
      });
      router.push(ROUTES.MAIN.PAYROLL_MANAGER.children.EMPLOYEE_SHIFT_ASSIGNMENTS.path);
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật gán ca làm việc";
      showToast({
        type: "error",
        title: "Lỗi",
        message: errorMsg,
      });
    },
  });

  return {
    onUpdateEmployeeShiftAssignment: update,
    isLoading: isPending,
  };
};

export const useDeleteEmployeeShiftAssignment = (id: string) => {
  const showToast = useToast();
  const queryClient = useQueryClient();

  const { mutate: deleteAssignment, isPending } = useMutation({
    mutationFn: () =>
      rootApiService.delete<void>(
        API_ENDPOINTS.SHIFT_ASSIGNMENT.DELETE(id)
      ),
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Thành công",
        message: "Xóa gán ca làm việc thành công",
      });
      queryClient.invalidateQueries({
        queryKey: ["employeeShiftAssignments"],
      });
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message || "Có lỗi xảy ra khi xóa gán ca làm việc";
      showToast({
        type: "error",
        title: "Lỗi",
        message: errorMsg,
      });
    },
  });

  return {
    onDeleteEmployeeShiftAssignment: deleteAssignment,
    isLoading: isPending,
  };
};
