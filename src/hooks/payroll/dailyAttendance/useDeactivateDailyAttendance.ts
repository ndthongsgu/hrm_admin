import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeactivateDailyAttendance = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.delete<void>(
        API_ENDPOINTS.DAILY_ATTENDANCE.DEACTIVATE(id),
        {},
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DAILY_ATTENDANCE.PAGINATION],
      });
    },
  });

  return {
    onDeactivateDailyAttendance: mutateAsync,
    isLoading: isPending,
    error,
  };
};