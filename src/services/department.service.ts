import type {
  DepartmentDto,
  DepartmentCreateDto,
  DepartmentUpdateDto,
  DepartmentPageRequest,
  DepartmentSelectDto,
} from "@/dto/department.dto";
import type { PageResponse } from "@/dto/base.dto";
import { API_ENDPOINTS } from "./api-route";
import rootApiService from "./api.service";

export const departmentService = {
  /**
   * Get paginated list of departments
   */
  getPagination: async (params: DepartmentPageRequest): Promise<PageResponse<DepartmentDto>> => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortDirection && { sortDirection: params.sortDirection }),
      ...(params.code && { code: params.code }),
      ...(params.name && { name: params.name }),
      ...(params.managerId && { managerId: params.managerId }),
      ...(params.parentDepartmentId && { parentDepartmentId: params.parentDepartmentId }),
      ...(params.isActive !== undefined && { isActive: params.isActive.toString() }),
    });

    return rootApiService.get<PageResponse<DepartmentDto>>(
      `${API_ENDPOINTS.DEPARTMENT.PAGINATION}?${queryParams}`
    );
  },

  /**
   * Get all departments
   */
  getAll: async (): Promise<DepartmentDto[]> => {
    return rootApiService.get<DepartmentDto[]>(API_ENDPOINTS.DEPARTMENT.GET_ALL);
  },

  /**
   * Get department by ID
   */
  getById: async (id: string): Promise<DepartmentDto> => {
    return rootApiService.get<DepartmentDto>(API_ENDPOINTS.DEPARTMENT.FIND_BY_ID(id));
  },

  /**
   * Create new department
   */
  create: async (data: DepartmentCreateDto): Promise<DepartmentDto> => {
    return rootApiService.post<DepartmentDto>(API_ENDPOINTS.DEPARTMENT.CREATE, data);
  },

  /**
   * Update department
   */
  update: async (id: string, data: DepartmentUpdateDto): Promise<DepartmentDto> => {
    return rootApiService.put<DepartmentDto>(API_ENDPOINTS.DEPARTMENT.UPDATE(id), data);
  },

  /**
   * Activate department
   */
  activate: async (id: string): Promise<void> => {
    return rootApiService.put<void>(API_ENDPOINTS.DEPARTMENT.ACTIVATE(id), {});
  },

  /**
   * Deactivate department
   */
  deactivate: async (id: string): Promise<void> => {
    return rootApiService.put<void>(API_ENDPOINTS.DEPARTMENT.DEACTIVATE(id), {});
  },

  /**
   * Get department select options (for dropdowns)
   */
  getSelectOptions: async (): Promise<DepartmentSelectDto[]> => {
    return rootApiService.get<DepartmentSelectDto[]>(API_ENDPOINTS.DEPARTMENT.SELECT);
  },
};

export default departmentService;
