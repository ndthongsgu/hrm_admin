import type {
  PositionDto,
  PositionCreateDto,
  PositionUpdateDto,
  PositionPageRequest,
  PositionSelectDto,
} from "@/dto/position.dto";
import type { PageResponse } from "@/dto/base.dto";
import { API_ENDPOINTS } from "./api-route";
import rootApiService from "./api.service";

export const positionService = {
  /**
   * Get paginated list of positions
   */
  getPagination: async (params: PositionPageRequest): Promise<PageResponse<PositionDto>> => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortDirection && { sortDirection: params.sortDirection }),
      ...(params.code && { code: params.code }),
      ...(params.name && { name: params.name }),
      ...(params.level !== undefined && { level: params.level.toString() }),
      ...(params.isActive !== undefined && { isActive: params.isActive.toString() }),
    });

    return rootApiService.get<PageResponse<PositionDto>>(
      `${API_ENDPOINTS.POSITION.PAGINATION}?${queryParams}`
    );
  },

  /**
   * Get all positions
   */
  getAll: async (): Promise<PositionDto[]> => {
    return rootApiService.get<PositionDto[]>(API_ENDPOINTS.POSITION.GET_ALL);
  },

  /**
   * Get position by ID
   */
  getById: async (id: string): Promise<PositionDto> => {
    return rootApiService.get<PositionDto>(API_ENDPOINTS.POSITION.FIND_BY_ID(id));
  },

  /**
   * Create new position
   */
  create: async (data: PositionCreateDto): Promise<PositionDto> => {
    return rootApiService.post<PositionDto>(API_ENDPOINTS.POSITION.CREATE, data);
  },

  /**
   * Update position
   */
  update: async (id: string, data: PositionUpdateDto): Promise<PositionDto> => {
    return rootApiService.put<PositionDto>(API_ENDPOINTS.POSITION.UPDATE(id), data);
  },

  /**
   * Activate position
   */
  activate: async (id: string): Promise<void> => {
    return rootApiService.put<void>(API_ENDPOINTS.POSITION.ACTIVATE(id), {});
  },

  /**
   * Deactivate position
   */
  deactivate: async (id: string): Promise<void> => {
    return rootApiService.put<void>(API_ENDPOINTS.POSITION.DEACTIVATE(id), {});
  },

  /**
   * Get position select options (for dropdowns)
   */
  getSelectOptions: async (): Promise<PositionSelectDto[]> => {
    return rootApiService.get<PositionSelectDto[]>(API_ENDPOINTS.POSITION.SELECT);
  },
};

export default positionService;
