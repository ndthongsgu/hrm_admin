import type {
  RoleDto,
  RoleCreateDto,
  RoleUpdateDto,
  RolePageRequest,
  RoleSelectDto,
} from "@/dto/role.dto";
import type { PageResponse } from "@/dto/base.dto";
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

    return rootApiService.get<PageResponse<RoleDto>>(
      `${API_ENDPOINTS.ROLE.PAGINATION}?${queryParams}`
    );
  },

  /**
   * Get all roles
   */
  getAll: async (): Promise<RoleDto[]> => {
    return rootApiService.get<RoleDto[]>(API_ENDPOINTS.ROLE.LIST_ALL);
  },

  /**
   * Get role by ID
   */
  getById: async (id: string): Promise<RoleDto> => {
    return rootApiService.get<RoleDto>(API_ENDPOINTS.ROLE.DETAIL(id));
  },

  /**
   * Create new role
   */
  create: async (data: RoleCreateDto): Promise<RoleDto> => {
    return rootApiService.post<RoleDto>(API_ENDPOINTS.ROLE.CREATE, data);
  },

  /**
   * Update role
   */
  update: async (id: string, data: RoleUpdateDto): Promise<RoleDto> => {
    return rootApiService.put<RoleDto>(API_ENDPOINTS.ROLE.UPDATE(id), data);
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
