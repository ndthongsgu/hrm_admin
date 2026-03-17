import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../layout/useToast";

export const useApproveAttendance = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onApproveAttendance, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<SuccessResponse>(
          `${API_ENDPOINTS.ATTENDANCE_SUMMARY.APPROVE(id)}`,
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.ATTENDANCE_SUMMARY.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Duyệt tóm tắt chấm công thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Duyệt tóm tắt chấm công thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onApproveAttendance, isLoading };
};
