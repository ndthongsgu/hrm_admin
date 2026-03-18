import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useActivateOfficeLocation = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateOfficeLocation, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.put<SuccessResponse>(
          API_ENDPOINTS.OFFICE_LOCATION.ACTIVATE(id),
          {},
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.OFFICE_LOCATION.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt thành công!",
          title: "Thành công",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Kích hoạt thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onActivateOfficeLocation, isLoading };
};
