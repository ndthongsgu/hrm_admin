import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useUnApproveOfficeLocation = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onUnApproveOfficeLocation, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.OFFICE_LOCATION.UNAPPROVE(id),
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.OFFICE_LOCATION.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Hủy duyệt địa điểm văn phòng thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Hủy duyệt địa điểm văn phòng thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onUnApproveOfficeLocation, isLoading };
};
