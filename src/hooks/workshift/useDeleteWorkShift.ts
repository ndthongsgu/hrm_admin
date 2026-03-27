import type { SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useDeleteWorkShift = (id: string) => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();

  const { mutateAsync: onDeleteWorkShift, isPending: isLoading } =
    useMutation({
      mutationFn: () =>
        rootApiService.delete<SuccessResponse>(
          API_ENDPOINTS.WORK_SHIFT.DELETE(id),
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.WORK_SHIFT.SEARCH],
        });
        showToast({
          type: "success",
          message: res.message || "Xóa ca làm việc thành công!",
          title: "Thành công",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Xóa ca làm việc thất bại!",
          title: "Thất bại",
        });
      },
    });

  return {
    onDeleteWorkShift,
    isLoading,
  };
};
