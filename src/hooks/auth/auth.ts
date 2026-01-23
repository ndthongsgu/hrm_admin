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
        setTokens(data.accessToken, data.refreshToken || "");
        // const userInfo: UserInfo = {
        //   userId: data.id,
        //   username: data.username,
        //   email: data.email,
        //   name: data.username,
        //   isAdmin: data.roles?.includes('ROLE_ADMIN') || false,
        //   isGoogle: false,
        //   permissions: {},
        // };
        // setUserInfo(userInfo);

        queryClient.clear();
        // Redirect to dashboard/home page, replace history to prevent back button to login
        navigate('/', { replace: true });
      } catch (error) {
        console.error("[useLogin] Failed to process login:", error);
        // Still navigate even if processing fails
        queryClient.clear();
        // Redirect to dashboard/home page, replace history to prevent back button to login
        navigate('/', { replace: true });
      }
    },
    onError: (error: any) => {
      // The error message will now be the actual server message
      throw new Error(error.message || 'Login failed');
    },
  });
};

export const useProfile = () => {
  // Backend doesn't have /me endpoint, disable this query
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => Promise.resolve(null as UserProfile | null),
    retry: false,
    enabled: false, // Disable query because backend doesn't have endpoint
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