import type {
  DependentCreateDto,
  DependentDto,
  DependentUpdateDto,
} from "@/dto/dependent.dto";
import { API_ENDPOINTS } from "./api-route";
import rootApiService from "./api.service";

export const dependentService = {
  getById: async (id: string): Promise<DependentDto> => {
    return rootApiService.get<DependentDto>(API_ENDPOINTS.DEPENDENT.FIND_BY_ID(id));
  },

  create: async (data: DependentCreateDto): Promise<DependentDto> => {
    return rootApiService.post<DependentDto>(API_ENDPOINTS.DEPENDENT.CREATE, data);
  },

  update: async (id: string, data: DependentUpdateDto): Promise<DependentDto> => {
    return rootApiService.put<DependentDto>(API_ENDPOINTS.DEPENDENT.UPDATE(id), data);
  },
};

export default dependentService;
