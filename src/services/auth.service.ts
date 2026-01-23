import type {
  AuthResponse,
  LoginRequest,
  UserInfo,
  UserProfile,
} from "@/dto/auth.dto";
import { API_ENDPOINTS } from "@/services/api-route";
import { apiRequest } from "@/utils/api-client";
import { useAuthStore } from "@/hooks/auth/useAuthStore";
import rootApiService from "./api.service";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiRequest.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    // Note: Token storage is now handled by Zustand store (useAuthStore)
    // No need to manually set localStorage
    const authData = response.data;
    return authData;
  },

  logout: async (): Promise<void> => {
    await apiRequest.post(API_ENDPOINTS.AUTH.LOGOUT);
    // Note: Token clearing is now handled by Zustand store (useAuthStore.clearTokens)
    // No need to manually remove localStorage items
    useAuthStore.getState().clearTokens();
  },

  getProfile: async (): Promise<UserProfile> => {
    // Backend doesn't have /me endpoint, throw error
    throw new Error("Backend doesn't have /me endpoint");
    // const response = await apiRequest.get<UserProfile>(
    //   API_ENDPOINTS.AUTH.PROFILE
    // );
    // return response.data;
  },

  getUserInfo: async (): Promise<UserInfo> => {
    const response = await rootApiService.get<{ data: UserInfo }>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await apiRequest.post<{ token: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return response.data;
  },

  isAuthenticated: (): boolean => {
    // Use Zustand store instead of localStorage
    return useAuthStore.getState().isAuthenticated;
  },

  getToken: (): string | null => {
    // Use Zustand store instead of localStorage
    return useAuthStore.getState().getAccessToken();
  },
};

export default authService;
