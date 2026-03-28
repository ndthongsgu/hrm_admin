import type {
  SysSettingDto,
  TaxBracketDto,
  InsuranceConfigDto,
} from "@/dto/settings.dto";
import type { PaginationDto } from "@/dto/base.dto";
import type { SuccessResponse } from "@/dto/pagination.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

// ─────────────────────────────────────────────────
// SYS SETTINGS
// ─────────────────────────────────────────────────

interface PageResult<T> {
  items: T[];
  totalElements: number;
}

function toPageResult<T>(raw: any): PageResult<T> {
  if (!raw) return { items: [], totalElements: 0 };
  // backend wraps in {success, data: {items, totalElements}}
  const d = raw.data ?? raw;
  return {
    items: d.items ?? d.content ?? [],
    totalElements: d.totalElements ?? (d.items ?? d.content ?? []).length,
  };
}

const buildQueryParams = (params: PaginationDto<Record<string, any>>) => {
  const where = params.where || {};
  const cleanedWhere = Object.fromEntries(
    Object.entries(where).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    }),
  );

  return {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: params.sortBy || "createdAt",
    sortDirection: params.sortDirection || "DESC",
    ...cleanedWhere,
  };
};

export const useListSysSettings = (
  params: PaginationDto<Record<string, any>>,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.SYS_SETTING.PAGINATION, params],
    queryFn: () =>
      rootApiService
        .get<any>(
          API_ENDPOINTS.SYS_SETTING.PAGINATION,
          buildQueryParams(params),
        )
        .then(toPageResult<SysSettingDto>),
  });
  return {
    data: data?.items ?? [],
    total: data?.totalElements ?? 0,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateSysSetting = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onCreateSysSetting, isPending: isLoading } = useMutation(
    {
      mutationFn: (body: SysSettingDto) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.SYS_SETTING.CREATE,
          body,
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SYS_SETTING.PAGINATION],
        });
        showToast({
          type: "success",
          message: "Tạo cài đặt thành công!",
          title: "Thành công",
        });
      },
      onError: (e: any) => {
        showToast({
          type: "error",
          message: e?.message ?? "Tạo thất bại!",
          title: "Thất bại",
        });
      },
    },
  );
  return { onCreateSysSetting, isLoading };
};

export const useUpdateSysSetting = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onUpdateSysSetting, isPending: isLoading } = useMutation(
    {
      mutationFn: ({ id, body }: { id: string; body: SysSettingDto }) =>
        rootApiService.put<SuccessResponse>(
          API_ENDPOINTS.SYS_SETTING.UPDATE(id),
          body,
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SYS_SETTING.PAGINATION],
        });
        showToast({
          type: "success",
          message: "Cập nhật thành công!",
          title: "Thành công",
        });
      },
      onError: (e: any) => {
        showToast({
          type: "error",
          message: e?.message ?? "Cập nhật thất bại!",
          title: "Thất bại",
        });
      },
    },
  );
  return { onUpdateSysSetting, isLoading };
};

export const useDeleteSysSetting = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onDeleteSysSetting, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.delete<SuccessResponse>(
          API_ENDPOINTS.SYS_SETTING.FIND_BY_ID(id),
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SYS_SETTING.PAGINATION],
        });
        showToast({
          type: "success",
          message: "Xoá thành công!",
          title: "Thành công",
        });
      },
      onError: (e: any) => {
        showToast({
          type: "error",
          message: e?.message ?? "Xoá thất bại!",
          title: "Thất bại",
        });
      },
    },
  );
  return { onDeleteSysSetting, isLoading };
};

// ─────────────────────────────────────────────────
// TAX BRACKETS
// ─────────────────────────────────────────────────

export const useListTaxBrackets = (
  params: PaginationDto<Record<string, any>>,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.TAX_BRACKET.PAGINATION, params],
    queryFn: () =>
      rootApiService
        .get<any>(
          API_ENDPOINTS.TAX_BRACKET.PAGINATION,
          buildQueryParams(params),
        )
        .then(toPageResult<TaxBracketDto>),
  });
  return {
    data: data?.items ?? [],
    total: data?.totalElements ?? 0,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateTaxBracket = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onCreateTaxBracket, isPending: isLoading } = useMutation(
    {
      mutationFn: (body: TaxBracketDto) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.TAX_BRACKET.CREATE,
          body,
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TAX_BRACKET.PAGINATION],
        });
        showToast({
          type: "success",
          message: "Tạo bậc thuế thành công!",
          title: "Thành công",
        });
      },
      onError: (e: any) => {
        showToast({
          type: "error",
          message: e?.message ?? "Tạo thất bại!",
          title: "Thất bại",
        });
      },
    },
  );
  return { onCreateTaxBracket, isLoading };
};

export const useUpdateTaxBracket = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onUpdateTaxBracket, isPending: isLoading } = useMutation(
    {
      mutationFn: ({ id, body }: { id: string; body: TaxBracketDto }) =>
        rootApiService.put<SuccessResponse>(
          API_ENDPOINTS.TAX_BRACKET.UPDATE(id),
          body,
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TAX_BRACKET.PAGINATION],
        });
        showToast({
          type: "success",
          message: "Cập nhật bậc thuế thành công!",
          title: "Thành công",
        });
      },
      onError: (e: any) => {
        showToast({
          type: "error",
          message: e?.message ?? "Cập nhật thất bại!",
          title: "Thất bại",
        });
      },
    },
  );
  return { onUpdateTaxBracket, isLoading };
};

export const useDeleteTaxBracket = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onDeleteTaxBracket, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.delete<SuccessResponse>(
          API_ENDPOINTS.TAX_BRACKET.FIND_BY_ID(id),
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TAX_BRACKET.PAGINATION],
        });
        showToast({
          type: "success",
          message: "Xoá bậc thuế thành công!",
          title: "Thành công",
        });
      },
      onError: (e: any) => {
        showToast({
          type: "error",
          message: e?.message ?? "Xoá thất bại!",
          title: "Thất bại",
        });
      },
    },
  );
  return { onDeleteTaxBracket, isLoading };
};

// ─────────────────────────────────────────────────
// INSURANCE CONFIGS
// ─────────────────────────────────────────────────

export const useListInsuranceConfigs = (
  params: PaginationDto<Record<string, any>>,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.INSURANCE_CONFIG.PAGINATION, params],
    queryFn: () =>
      rootApiService
        .get<any>(
          API_ENDPOINTS.INSURANCE_CONFIG.PAGINATION,
          buildQueryParams(params),
        )
        .then(toPageResult<InsuranceConfigDto>),
  });
  return {
    data: data?.items ?? [],
    total: data?.totalElements ?? 0,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateInsuranceConfig = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onCreateInsuranceConfig, isPending: isLoading } =
    useMutation({
      mutationFn: (body: InsuranceConfigDto) =>
        rootApiService.post<SuccessResponse>(
          API_ENDPOINTS.INSURANCE_CONFIG.CREATE,
          body,
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.INSURANCE_CONFIG.PAGINATION],
        });
        showToast({
          type: "success",
          message: "Tạo cấu hình bảo hiểm thành công!",
          title: "Thành công",
        });
      },
      onError: (e: any) => {
        showToast({
          type: "error",
          message: e?.message ?? "Tạo thất bại!",
          title: "Thất bại",
        });
      },
    });
  return { onCreateInsuranceConfig, isLoading };
};

export const useUpdateInsuranceConfig = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onUpdateInsuranceConfig, isPending: isLoading } =
    useMutation({
      mutationFn: ({ id, body }: { id: string; body: InsuranceConfigDto }) =>
        rootApiService.put<SuccessResponse>(
          API_ENDPOINTS.INSURANCE_CONFIG.UPDATE(id),
          body,
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.INSURANCE_CONFIG.PAGINATION],
        });
        showToast({
          type: "success",
          message: "Cập nhật cấu hình BH thành công!",
          title: "Thành công",
        });
      },
      onError: (e: any) => {
        showToast({
          type: "error",
          message: e?.message ?? "Cập nhật thất bại!",
          title: "Thất bại",
        });
      },
    });
  return { onUpdateInsuranceConfig, isLoading };
};

export const useDeleteInsuranceConfig = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { mutateAsync: onDeleteInsuranceConfig, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.delete<SuccessResponse>(
          API_ENDPOINTS.INSURANCE_CONFIG.FIND_BY_ID(id),
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.INSURANCE_CONFIG.PAGINATION],
        });
        showToast({
          type: "success",
          message: "Xoá cấu hình BH thành công!",
          title: "Thành công",
        });
      },
      onError: (e: any) => {
        showToast({
          type: "error",
          message: e?.message ?? "Xoá thất bại!",
          title: "Thất bại",
        });
      },
    });
  return { onDeleteInsuranceConfig, isLoading };
};
