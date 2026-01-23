import type {
  UserDto,
  UserCreateDto,
  UserUpdateDto,
  UserPageRequest,
  UserSelectDto,
} from "@/dto/user.dto";
import type { PageResponse } from "@/dto/base.dto";
import { API_ENDPOINTS } from "./api-route";
import rootApiService from "./api.service";

export const userService = {
  /**
   * Get paginated list of users
   */
  getPagination: async (params: UserPageRequest): Promise<PageResponse<UserDto>> => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortDirection && { sortDirection: params.sortDirection }),
      ...(params.username && { username: params.username }),
      ...(params.email && { email: params.email }),
      ...(params.fullName && { fullName: params.fullName }),
      ...(params.phoneNumber && { phoneNumber: params.phoneNumber }),
      ...(params.isActive !== undefined && { isActive: params.isActive.toString() }),
    });

    if (params.roleIds?.length) {
      params.roleIds.forEach(roleId => queryParams.append('roleIds', roleId));
    }

    return rootApiService.get<PageResponse<UserDto>>(
      `${API_ENDPOINTS.USER.PAGINATION}?${queryParams}`
    );
  },

  /**
   * Get all users
   */
  getAll: async (): Promise<UserDto[]> => {
    return rootApiService.get<UserDto[]>(API_ENDPOINTS.USER.GET_ALL);
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<UserDto> => {
    return rootApiService.get<UserDto>(API_ENDPOINTS.USER.FIND_BY_ID(id));
  },

  /**
   * Create new user
   */
  create: async (data: UserCreateDto): Promise<UserDto> => {
    return rootApiService.post<UserDto>(API_ENDPOINTS.USER.CREATE, data);
  },

  /**
   * Update user
   */
  update: async (id: string, data: UserUpdateDto): Promise<UserDto> => {
    return rootApiService.put<UserDto>(API_ENDPOINTS.USER.UPDATE(id), data);
  },

  /**
   * Activate user
   */
  activate: async (id: string): Promise<void> => {
    return rootApiService.put<void>(API_ENDPOINTS.USER.ACTIVATE(id), {});
  },

  /**
   * Deactivate user
   */
  deactivate: async (id: string): Promise<void> => {
    return rootApiService.put<void>(API_ENDPOINTS.USER.DEACTIVATE(id), {});
  },

  /**
   * Get user select options (for dropdowns)
   */
  getSelectOptions: async (): Promise<UserSelectDto[]> => {
    return rootApiService.get<UserSelectDto[]>(API_ENDPOINTS.USER.SELECT);
  },

  /**
   * Get roles for a specific user
   */
  getUserRoles: async (id: string): Promise<any[]> => {
    return rootApiService.get<any[]>(API_ENDPOINTS.USER.GET_ROLES(id));
  },
};

export default userService;
