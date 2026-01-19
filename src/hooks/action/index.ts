import type { ActionLogDto } from "@/dto/base.dto";
import type { PaginationResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services/api-route";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export interface ActionLogFilter {
  functionType?: string;
  functionId?: string;
  type?: string;
  createdBy?: string;
}

interface ActionLogSearchDto {
  skip?: number;
  take?: number;
  where?: ActionLogFilter;
}

export const ActionType = {
  Create: "Thêm",
  Update: "Sửa",
  Delete: "Xoá",
  Cancel: "Hủy",
  Approve: "Duyệt",
  Deactivate: "Ngừng hoạt động",
  Activate: "Kích hoạt",
};

export const useActionLogPagination = (params: ActionLogSearchDto) => {
  const url = API_ENDPOINTS.ACTION_LOG.PAGINATION;

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url, params],
    queryFn: async () => {
      try {
        const response = await rootApiService.post<
          PaginationResponse<ActionLogDto>
        >(url, params);
        return response;
      } catch (err) {
        console.error("API Error:", err);
        throw err;
      }
    },
  });

  return {
    data: data?.content ?? [],
    total: data?.totalElements ?? 0,
    isLoading,
    refetch,
    error,
  };
};
