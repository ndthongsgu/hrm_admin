import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useToast } from "@/hooks/layout/useToast";

export const useBulkApproveAttendance = () => {
  const showToast = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: onBulkApproveAttendance } = useMutation({
    mutationFn: (ids: string[]) =>
    {
      return rootApiService.post<string>(API_ENDPOINTS.ATTENDANCE_SUMMARY.BULK_APPROVE, { ids })
    },
    onSuccess: (res: string) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ATTENDANCE_SUMMARY.PAGINATION],
      });
      showToast({
        type: "success",
        message: res|| "Duyệt tóm tắt chấm công thành công!",
        title: "Thành công",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error || "Duyệt tóm tắt chấm công thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onBulkApproveAttendance };
};
