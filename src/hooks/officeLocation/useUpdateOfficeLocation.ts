import type { SuccessResponse } from "@/dto/pagination.dto";
import type { OfficeLocationDto } from "@/dto/officeLocation.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";
import { useRouter } from "@/routes/hooks/use-router";

export const useUpdateOfficeLocation = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
    const router = useRouter();
  const { mutateAsync: onUpdateOfficeLocation, isPending: isLoading } =
    useMutation({
      mutationFn: (params: { id: string; data: Partial<OfficeLocationDto> }) =>
        rootApiService.put<SuccessResponse>(
          API_ENDPOINTS.OFFICE_LOCATION.UPDATE(params.id),
          params.data,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.OFFICE_LOCATION.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật địa điểm văn phòng thành công!",
          title: "Thành công",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Cập nhật địa điểm văn phòng thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onUpdateOfficeLocation, isLoading };
};
