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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    // Log failed API calls for debugging
    if (error.response) {
      console.error(
        `[API Error] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`,
        {
          status: error.response.status,
          statusText: error.response.statusText,
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
            "Session expired. Please login again.",
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
              isAdmin: data.roles?.includes("ROLE_ADMIN") || false,
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
              "Session expired. Please login again.",
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

    // For auth endpoints or other 401 errors, just reject with the original error
    return Promise.reject(error);
  },
);

export default axiosInstance;
