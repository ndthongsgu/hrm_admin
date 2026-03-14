import type { AttendanceSummaryDto } from "@/dto/payroll.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useDetailAttendanceSummary = (id: string) => {
  const { data: rawData, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ATTENDANCE_SUMMARY.FIND_BY_ID(id)],
    queryFn: () =>
      rootApiService.get<AttendanceSummaryDto>(
        API_ENDPOINTS.ATTENDANCE_SUMMARY.FIND_BY_ID(id),
      ),
    enabled: !!id,
  });

  // Enrich data with payrollPeriodId and employeeId
  const data = rawData
    ? {
        ...rawData,
        payrollPeriodId: rawData.payrollPeriod?.id || "",
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
