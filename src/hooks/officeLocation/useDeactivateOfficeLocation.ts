import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useDeactivateOfficeLocation = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeactivateOfficeLocation, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.delete<SuccessResponse>(
          API_ENDPOINTS.OFFICE_LOCATION.DELETE(id),
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.OFFICE_LOCATION.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Ngừng hoạt động thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Ngừng hoạt động thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onDeactivateOfficeLocation, isLoading };
};
