import type { DailyAttendanceDto } from "@/dto/payroll.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateDailyAttendance = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (data: DailyAttendanceDto) =>
      rootApiService.post<DailyAttendanceDto>(
        API_ENDPOINTS.DAILY_ATTENDANCE.CREATE,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DAILY_ATTENDANCE.PAGINATION],
      });

      router.back();
    },
  });

  return {
    onCreateDailyAttendance: mutateAsync,
    isLoading: isPending,
    error,
  };
};