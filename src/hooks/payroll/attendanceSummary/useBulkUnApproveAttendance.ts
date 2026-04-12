import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useToast } from "@/hooks/layout/useToast";

export const useBulkUnApproveAttendance = () => {
  const showToast = useToast();
  const queryClient = useQueryClient();
  

  const { mutateAsync: onBulkUnApproveAttendance } = useMutation({
    mutationFn: (ids: string[]) =>
    {
      return rootApiService.post<string>(API_ENDPOINTS.ATTENDANCE_SUMMARY.BULK_UNAPPROVE, { ids })
    },
    onSuccess: (res: string) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ATTENDANCE_SUMMARY.PAGINATION],
      });
      showToast({
        type: "success",
        message: res|| "Hủy duyệt tóm tắt chấm công thành công!",
        title: "Thành công",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error|| "Hủy duyệt tóm tắt chấm công thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onBulkUnApproveAttendance };
};