import type { WorkShiftDto } from "@/dto/workshift.dto";
import type { SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useCreateWorkShift = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();

  const { mutateAsync: onCreateWorkShift, isPending: isLoading } =
    useMutation({
      mutationFn: (body: WorkShiftDto) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.WORK_SHIFT.CREATE,
          body,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.WORK_SHIFT.SEARCH],
        });
        showToast({
          type: "success",
          message: res.message || "Tạo ca làm việc thành công!",
          title: "Thành công",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tạo ca làm việc thất bại!",
          title: "Thất bại",
        });
      },
    });

  return {
    onCreateWorkShift,
    isLoading,
  };
};
