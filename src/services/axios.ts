import axios from "axios";
import API_ENDPOINTS, { API_ROUTES } from "./api-route";
import { useAuthStore } from "@/hooks/auth/useAuthStore";
import type { AuthResponse, UserInfo } from "@/dto/auth.dto";

const axiosInstance = axios.create({
  baseURL: API_ROUTES.BASE_URL,
  timeout: API_ROUTES.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  transformRequest: [
    (data, headers) => {
      // If data is FormData, don't stringify and remove Content-Type header
      // Let browser/axios auto-detect and set multipart/form-data
      if (data instanceof FormData) {
        // Delete Content-Type to allow browser to set it with boundary
        delete headers["Content-Type"];
        return data;
      }
      
      // For non-FormData, use default JSON stringify
      return JSON.stringify(data);
    },
  ],
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Request interceptor: attach access token
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().getAccessToken();
  const skipAuth = config.headers?.["x-skip-auth"] === "true";

  if (token && !skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Remove the custom header after reading it
  delete config.headers?.["x-skip-auth"];
  return config;
});

// Response interceptor: handle 401 and refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Unwrap backend response format: {success: true, data: {...}, timestamp: "..."}
    // and map pagination items to content for consistency
    const responseData = response.data;
    
    // Check if response has the wrapped format: {success: true, data: {...}}
    if (responseData && typeof responseData === 'object' && 'success' in responseData && 'data' in responseData) {
      const innerData = responseData.data;
      
      // Check if this is a pagination response with items array
      if (innerData && typeof innerData === 'object' && 'items' in innerData && Array.isArray(innerData.items)) {
        // Map items to content for frontend consistency
        response.data = {
          content: innerData.items,
          totalElements: innerData.totalElements || 0,
          totalPages: innerData.totalPages,
          page: innerData.page,
          size: innerData.size,
          message: responseData.message,
        };
      } else if (innerData) {
        // For non-pagination responses, just unwrap the data
        response.data = innerData;
      }
    }
    // If response doesn't have wrapped format, return as-is (backward compatibility)
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    // Extract error message from backend response
    let errorMessage = "Có lỗi xảy ra";
    if (error.response?.data) {
      const responseData = error.response.data;
      // Try to get message from different response formats
      if (responseData.message) {
        errorMessage = responseData.message; // BaseResponse format
      } else if (responseData.error) {
        errorMessage = responseData.error; // Some APIs use 'error' field
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Log failed API calls for debugging with clear error message
    if (error.response) {
      console.error(
        `[API Error] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`,
        {
          status: error.response.status,
          statusText: error.response.statusText,
          errorMessage: errorMessage,
          data: error.response.data,
        },
      );
    } else {
      console.error(
        `[API Error] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`,
        {
          message: error.message,
          code: error.code,
        },
      );
    }

    // Don't try to refresh token for these cases:
    // 1. Auth-related endpoints (login, refresh, password reset)
    // 2. Requests that explicitly skip auth
    // 3. Already retried requests
    const isAuthEndpoint = originalRequest.url?.includes("/auth/");
    const skipAuth = originalRequest.headers?.["x-skip-auth"] === "true";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint &&
      !skipAuth
    ) {
      originalRequest._retry = true;

      const refreshToken = authStore.refreshToken;

      if (!refreshToken || refreshToken === "") {
        console.warn("[Token Refresh] No refresh token available");
        authStore.clearTokens();
        if (!window.location.pathname.includes("/login")) {
          window.location.href = `/login?message=${encodeURIComponent(
            "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
          )}`;
        }
        return Promise.reject(error);
      }
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          console.log("[Token Refresh] Attempting to refresh token...");
          const { data } = await axios.post<AuthResponse>(
            `${API_ROUTES.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
            { refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          console.log("[Token Refresh] Token refreshed successfully");

          // Ensure accessToken exists (it's required in AuthResponse)
          const accessToken = data.accessToken || data.token;
          if (!accessToken) {
            throw new Error("No access token in refresh response");
          }

          authStore.setTokens(accessToken, data.refreshToken || "");

          // Update userInfo from refresh response if available
          if (data.id && data.username) {
            const userInfo: UserInfo = {
              userId: data.id,
              username: data.username,
              email: data.email || "",
              name: data.username,
              isAdmin: data.isAdmin || false,
              isGoogle: false,
              permissions: authStore.getUserInfo()?.permissions || {}, // Preserve existing permissions
            };
            authStore.setUserInfo(userInfo);
          }

          onRefreshed(accessToken);
          return axiosInstance(originalRequest);
        } catch (err: any) {
          console.error("[Token Refresh] Failed to refresh token:", err);
          authStore.clearTokens();
          if (!window.location.pathname.includes("/login")) {
            window.location.href = `/login?message=${encodeURIComponent(
              "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
            )}`;
          }
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    // Attach error message to error object for easier access in catch blocks
    error.errorMessage = errorMessage;

    // For auth endpoints or other 401 errors, just reject with the original error
    return Promise.reject(error);
  },
);

export default axiosInstance;
