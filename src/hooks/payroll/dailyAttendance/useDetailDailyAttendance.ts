import type { DailyAttendanceDto } from "@/dto/payroll.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useDetailDailyAttendance = (id: string) => {
  const { data: rawData, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.DAILY_ATTENDANCE.FIND_BY_ID(id)],
    queryFn: () =>
      rootApiService.get<DailyAttendanceDto>(
        API_ENDPOINTS.DAILY_ATTENDANCE.FIND_BY_ID(id),
      ),
    enabled: !!id,
  });

  // Enrich data with payrollPeriodId and employeeId
  const data = rawData
    ? {
        ...rawData,
        employeeId: rawData.employee?.id || "",
      }
    : undefined;


  return {
    data,
    isLoading,
    refetch,
    error,
  };
};