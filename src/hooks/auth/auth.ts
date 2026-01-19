import type { LoginRequest, AuthResponse, PasswordResetRequest, PasswordResetConfirmRequest, ChangePasswordRequest, UserProfile } from "@/dto/auth.dto";
import { API_ENDPOINTS } from "@/services/api-route";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./useAuthStore";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";

export const useLogin = () => {
  const { setTokens, setUserInfo } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await rootApiService.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
        {}, // headers
        { skipAuth: true } // This will prevent token refresh attempts
      );
      return response;
    },
    onSuccess: async (data) => {
      try {
        // Set tokens first
        setTokens(data.accessToken, data.refreshToken);
        
        // Load user info immediately after login
        const userInfo = await authService.getUserInfo();
        setUserInfo(userInfo);
        
        queryClient.clear();
        navigate('/');
      } catch (error) {
        console.error("[useLogin] Failed to load user info:", error);
        // Still navigate even if userInfo fails, will be loaded by AuthInitializer
        queryClient.clear();
        navigate('/');
      }
    },
    onError: (error: any) => {
      // The error message will now be the actual server message
      throw new Error(error.message || 'Login failed');
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: [API_ENDPOINTS.AUTH.PROFILE],
    queryFn: () => rootApiService.get<UserProfile>(API_ENDPOINTS.AUTH.PROFILE),
    retry: false, // Don't retry on 401
    enabled: useAuthStore.getState().isAuthenticated, // Only run if we think we're authenticated
  });
};

export const useLogout = () => {
  const { clearTokens } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await rootApiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    },
    onSuccess: () => {
      clearTokens();
      queryClient.clear();
      navigate('/login');
    },
    onError: () => {
      // Even if API call fails, clear local state
      clearTokens();
      queryClient.clear();
      navigate('/login');
    },
  });
};

export const useChangePassword = () => {
  const { clearTokens } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      await rootApiService.post(
        API_ENDPOINTS.AUTH.PASSWORD_CHANGE,
        data
      );
    },
    onSuccess: () => {
      // Clear tokens and redirect to login since all sessions are revoked
      clearTokens();
      queryClient.clear();
      navigate('/login?message=' + encodeURIComponent('Password changed successfully. Please login again.'));
    },
    onError: (error: any) => {
      throw new Error(error.message || 'Failed to change password');
    },
  });
};

export const usePasswordResetRequest = () => {
  return useMutation({
    mutationFn: async (data: PasswordResetRequest) => {
      await rootApiService.post(
        API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST,
        data,
      );
    },
  });
};

export const usePasswordResetConfirm = () => {
  return useMutation({
    mutationFn: async (data: PasswordResetConfirmRequest) => {
      await rootApiService.post(
        API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM,
        data,
      );
    },
  });
};