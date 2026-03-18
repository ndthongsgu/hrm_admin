import type { SuccessResponse } from "@/dto/pagination.dto";
import type { OfficeLocationDto } from "@/dto/officeLocation.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const useCreateOfficeLocation = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();

  const { mutateAsync: onCreateOfficeLocation, isPending: isLoading } =
    useMutation({
      mutationFn: (data: Partial<OfficeLocationDto>) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.OFFICE_LOCATION.CREATE,
          data,
        ),
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.OFFICE_LOCATION.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tạo địa điểm văn phòng thành công!",
          title: "Thành công",
        });
        router.back();
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Tạo địa điểm văn phòng thất bại!",
          title: "Thất bại",
        });
      },
    });

  return { onCreateOfficeLocation, isLoading };
};
