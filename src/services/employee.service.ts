import type {
  EmployeeDto,
  EmployeeCreateDto,
  EmployeeUpdateDto,
  EmployeePageRequest,
  EmployeeSelectDto,
} from "@/dto/employee.dto";
import type { PageResponse } from "@/dto/base.dto";
import { API_ENDPOINTS } from "./api-route";
import rootApiService from "./api.service";

export const employeeService = {
  /**
   * Get paginated list of employees
   */
  getPagination: async (params: EmployeePageRequest): Promise<PageResponse<EmployeeDto>> => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortDirection && { sortDirection: params.sortDirection }),
      ...(params.code && { code: params.code }),
      ...(params.fullName && { fullName: params.fullName }),
      ...(params.email && { email: params.email }),
      ...(params.phoneNumber && { phoneNumber: params.phoneNumber }),
      ...(params.departmentId && { departmentId: params.departmentId }),
      ...(params.positionId && { positionId: params.positionId }),
      ...(params.isActive !== undefined && { isActive: params.isActive.toString() }),
    });

    return rootApiService.get<PageResponse<EmployeeDto>>(
      `${API_ENDPOINTS.EMPLOYEE.PAGINATION}?${queryParams}`
    );
  },

  /**
   * Get all employees
   */
  getAll: async (): Promise<EmployeeDto[]> => {
    return rootApiService.get<EmployeeDto[]>(API_ENDPOINTS.EMPLOYEE.GET_ALL);
  },

  /**
   * Get employee by ID
   */
  getById: async (id: string): Promise<EmployeeDto> => {
    return rootApiService.get<EmployeeDto>(API_ENDPOINTS.EMPLOYEE.FIND_BY_ID(id));
  },

  /**
   * Create new employee
   */
  create: async (data: EmployeeCreateDto): Promise<EmployeeDto> => {
    return rootApiService.post<EmployeeDto>(API_ENDPOINTS.EMPLOYEE.CREATE, data);
  },

  /**
   * Update employee
   */
  update: async (id: string, data: EmployeeUpdateDto): Promise<EmployeeDto> => {
    return rootApiService.put<EmployeeDto>(API_ENDPOINTS.EMPLOYEE.UPDATE(id), data);
  },

  /**
   * Activate employee
   */
  activate: async (id: string): Promise<void> => {
    return rootApiService.put<void>(API_ENDPOINTS.EMPLOYEE.ACTIVATE(id), {});
  },

  /**
   * Deactivate employee
   */
  deactivate: async (id: string): Promise<void> => {
    return rootApiService.put<void>(API_ENDPOINTS.EMPLOYEE.DEACTIVATE(id), {});
  },

  /**
   * Get employee select options (for dropdowns)
   */
  getSelectOptions: async (): Promise<EmployeeSelectDto[]> => {
    return rootApiService.get<EmployeeSelectDto[]>(API_ENDPOINTS.EMPLOYEE.SELECT);
  },
};

export default employeeService;
