import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useActivateDailyAttendance = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.put<void>(
        API_ENDPOINTS.DAILY_ATTENDANCE.ACTIVATE(id),
        {},
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DAILY_ATTENDANCE.PAGINATION],
      });
    },
  });

  return {
    onActivateDailyAttendance: mutateAsync,
    isLoading: isPending,
    error,
  };
};