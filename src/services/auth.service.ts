import type {
  AuthResponse,
  LoginRequest,
  UserInfo,
  UserProfile,
} from "@/dto/auth.dto";
import { API_ENDPOINTS } from "@/services/api-route";
import { apiRequest } from "@/utils/api-client";
import rootApiService from "./api.service";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiRequest.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    // Store token from the new JWT response format
    const authData = response.data;
    localStorage.setItem("token", authData.token);
    // Store user info for later use
    localStorage.setItem("userId", authData.id);
    localStorage.setItem("username", authData.username);
    return authData;
  },

  logout: async (): Promise<void> => {
    await apiRequest.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
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
    // Backend doesn't have /auth/me endpoint, throw error
    throw new Error("Backend doesn't have /auth/me endpoint");
    // const response = await rootApiService.get<UserInfo>(API_ENDPOINTS.AUTH.ME);
    // return response;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await apiRequest.post<{ token: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },
};

export default authService;
