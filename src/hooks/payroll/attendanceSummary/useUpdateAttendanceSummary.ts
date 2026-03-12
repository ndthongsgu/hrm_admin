import type { SuccessResponse } from "@/dto/pagination.dto";
import type { AttendanceSummaryDto } from "@/dto/payroll.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useUpdateAttendanceSummary = (id: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onUpdateAttendanceSummary, isPending: isLoading } =
    useMutation({
      mutationFn: (data: Partial<AttendanceSummaryDto>) =>
        rootApiService.put<SuccessResponse>(
          API_ENDPOINTS.ATTENDANCE_SUMMARY.FIND_BY_ID(id),
          data,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.ATTENDANCE_SUMMARY.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật tóm tắt chấm công thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Cập nhật tóm tắt chấm công thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onUpdateAttendanceSummary, isLoading };
};
