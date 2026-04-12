import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import type { AttendanceSummarySearchRequest } from "@/dto/payroll.dto";

export const useGetAttendanceSummaryIdsByFilter = () => {
  return useMutation({
    mutationFn: (request: AttendanceSummarySearchRequest) =>
      rootApiService.post<string[]>(
        API_ENDPOINTS.ATTENDANCE_SUMMARY.IDS_BY_FILTER,
        {
          body: request,
        },
      ),
  });
};