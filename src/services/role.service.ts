import type {
  RoleDto,
  RoleCreateDto,
  RoleUpdateDto,
  RolePageRequest,
  RoleSelectDto,
} from "@/dto/role.dto";
import type { PageResponse } from "@/dto/base.dto";
import {
  transformRoleFromBackend,
  transformRoleToBackend,
} from "@/dto/role.dto";
import { API_ENDPOINTS } from "./api-route";
import rootApiService from "./api.service";

export const roleService = {
  /**
   * Get paginated list of roles
   */
  getPagination: async (params: RolePageRequest): Promise<PageResponse<RoleDto>> => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortDirection && { sortDirection: params.sortDirection }),
      ...(params.code && { code: params.code }),
      ...(params.name && { name: params.name }),
      ...(params.isActive !== undefined && { isActive: params.isActive.toString() }),
    });

    const response = await rootApiService.get<{
      success: boolean;
      data: { items: any[]; totalElements: number; page: number; size: number };
    }>(`${API_ENDPOINTS.ROLE.PAGINATION}?${queryParams}`);

    return {
      data: response.data.items.map(transformRoleFromBackend),
      total: response.data.totalElements,
    };
  },

  /**
   * Get all roles
   */
  getAll: async (): Promise<RoleDto[]> => {
    const response = await rootApiService.get<{
      success: boolean;
      data: { items: any[] };
    }>(`${API_ENDPOINTS.ROLE.LIST_ALL}?page=0&size=1000`);
    return response.data.items.map(transformRoleFromBackend);
  },

  /**
   * Get role by ID
   */
  getById: async (id: string): Promise<RoleDto> => {
    const response = await rootApiService.get<{
      success: boolean;
      data: any;
    }>(API_ENDPOINTS.ROLE.DETAIL(id));
    return transformRoleFromBackend(response.data);
  },

  /**
   * Create new role
   */
  create: async (data: RoleCreateDto): Promise<RoleDto> => {
    const backendPayload = transformRoleToBackend(data);
    const response = await rootApiService.post<{
      success: boolean;
      data: any;
    }>(API_ENDPOINTS.ROLE.CREATE, backendPayload);
    return transformRoleFromBackend(response.data);
  },

  /**
   * Update role
   */
  update: async (id: string, data: RoleUpdateDto): Promise<RoleDto> => {
    const backendPayload = transformRoleToBackend(data);
    const response = await rootApiService.put<{
      success: boolean;
      data: any;
    }>(API_ENDPOINTS.ROLE.UPDATE(id), backendPayload);
    return transformRoleFromBackend(response.data);
  },

  /**
   * Activate role
   */
  activate: async (id: string): Promise<void> => {
    return rootApiService.put<void>(API_ENDPOINTS.ROLE.ACTIVATE(id), {});
  },

  /**
   * Deactivate role
   */
  deactivate: async (id: string): Promise<void> => {
    return rootApiService.put<void>(API_ENDPOINTS.ROLE.DEACTIVATE(id), {});
  },

  /**
   * Get role select options (for dropdowns)
   */
  getSelectOptions: async (): Promise<RoleSelectDto[]> => {
    return rootApiService.get<RoleSelectDto[]>(API_ENDPOINTS.ROLE.SELECT);
  },
};

export default roleService;
