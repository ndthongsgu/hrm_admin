import { useAuthStore } from "@/hooks/auth/useAuthStore";
import API_ENDPOINTS, { API_ROUTES } from "./api-route";
import axiosInstance from "./axios";
import type { AuthResponse, UserInfo } from "@/dto/auth.dto";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  headers?: Record<string, string>;
  params?: any;
  body?: any;
  timeout?: number;
  skipAuth?: boolean;
}

let refreshPromise: Promise<string> | null = null;

const handleTimeout = (timeout: number) =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), timeout),
  );

const refreshAccessToken = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  const authStore = useAuthStore.getState();
  const refreshToken = authStore.refreshToken;

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  console.log("[Token Refresh] Attempting to refresh token via fetch API...");
  refreshPromise = request<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, "POST", {
    skipAuth: true,
    body: { refreshToken },
  })
    .then((response) => {
      console.log("[Token Refresh] Token refreshed successfully via fetch API");
      const accessToken = response.accessToken || response.token;

      // Ensure accessToken exists (it's required in AuthResponse, but TypeScript needs this check)
      if (!accessToken) {
        throw new Error("No access token in refresh response");
      }

      authStore.setTokens(accessToken, response.refreshToken || "");

      // Update userInfo from refresh response if available
      if (response.id && response.username) {
        const userInfo: UserInfo = {
          userId: response.id,
          username: response.username,
          email: response.email || "",
          name: response.username,
          isAdmin: response.isAdmin || false,
          isGoogle: false,
          permissions: authStore.getUserInfo()?.permissions || {}, // Preserve existing permissions
        };
        authStore.setUserInfo(userInfo);
      }

      return accessToken; // Now TypeScript knows this is string, not undefined
    })
    .catch((error) => {
      console.error(
        "[Token Refresh] Failed to refresh token via fetch API:",
        error,
      );
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

const request = async <T>(
  url: string,
  method: HttpMethod,
  options: RequestOptions = {},
): Promise<T> => {
  const {
    headers = {},
    params,
    body,
    timeout = API_ROUTES.TIMEOUT,
    skipAuth = false,
  } = options;

  // Handle query parameters for GET requests
  if (params && method === "GET") {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    url = `${url}?${queryParams.toString()}`;
  }

  // Add authorization header if not skipped
  const finalHeaders = { ...API_ROUTES.HEADERS, ...headers };
  if (!skipAuth) {
    const authStore = useAuthStore.getState();
    const token = authStore.getAccessToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const fetchPromise = fetch(`${API_ROUTES.BASE_URL}${url}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (!res.ok) {
      // Log failed request for debugging
      console.error(`[API Error] ${method} ${url}`, {
        status: res.status,
        statusText: res.statusText,
      });

      // Handle 401 Unauthorized - try to refresh token
      if (res.status === 401 && !skipAuth && !url.includes("/auth/refresh")) {
        const authStore = useAuthStore.getState();
        const refreshToken = authStore.refreshToken;

        if (!refreshToken || refreshToken === "") {
          authStore.clearTokens();
          if (!window.location.pathname.includes("/login")) {
            window.location.href = `/login?message=${encodeURIComponent("Session expired. Please login again.")}`;
          }
          throw new Error("Unauthorized: Token expired and no refresh token");
        }
        try {
          const newToken = await refreshAccessToken();
          // Retry the original request with new token
          console.log(`[API Retry] Retrying ${method} ${url} with new token`);
          return request<T>(url, method, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        } catch (refreshError: any) {
          console.error(
            `[Token Refresh] Failed for ${method} ${url}:`,
            refreshError,
          );
          authStore.clearTokens();
          if (!window.location.pathname.includes("/login")) {
            window.location.href = `/login?message=${encodeURIComponent("Session expired. Please login again.")}`;
          }
          throw new Error("Unauthorized: Token refresh failed");
        }
      }

      const errorText = await res.text();
      throw new Error(errorText || res.statusText);
    }

    if (res.status === 204) {
      return {} as T;
    }

    const text = await res.text();
    if (!text) return {} as T;

    try {
      return JSON.parse(text) as T;
    } catch (_) {
      return text as unknown as T;
    }
  });

  return Promise.race([fetchPromise, handleTimeout(timeout)]);
};

export const rootApiServiceOld = {
  get: <T>(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>,
    options?: RequestOptions,
  ) => request<T>(url, "GET", { params, headers, ...options }),

  post: <T>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    options?: RequestOptions,
  ) => request<T>(url, "POST", { body, headers, ...options }),

  put: <T>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    options?: RequestOptions,
  ) => request<T>(url, "PUT", { body, headers, ...options }),

  delete: <T>(
    url: string,
    headers?: Record<string, string>,
    options?: RequestOptions,
  ) => request<T>(url, "DELETE", { headers, ...options }),

  patch: <T>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    options?: RequestOptions,
  ) => request<T>(url, "PATCH", { body, headers, ...options }),
};

export const requestAxios = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  options: RequestOptions = {},
): Promise<T> => {
  const {
    headers = {},
    params,
    body,
    timeout = API_ROUTES.TIMEOUT,
    skipAuth = false,
  } = options;

  // Check if body is FormData (multipart upload)
  const isFormData = body instanceof FormData;
  
  // Only set default headers if not FormData
  // For FormData, let axios auto-detect and set multipart/form-data
  const finalHeaders = isFormData
    ? {
        ...headers,
        ...(skipAuth ? { "x-skip-auth": "true" } : {}),
        // Remove Content-Type header for FormData - let axios/browser handle it
      }
    : {
        ...headers,
        ...(skipAuth ? { "x-skip-auth": "true" } : {}),
      };

  // Determine if this is a payment endpoint
  const isPaymentEndpoint =
    url.includes("/payments") || url.includes("/payment-methods");
  const baseURL = isPaymentEndpoint
    ? API_ROUTES.PAYMENT_BASE_URL
    : API_ROUTES.BASE_URL;

  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      headers: finalHeaders,
      params,
      data: body,
      timeout,
      baseURL, // Override base URL for payment endpoints
    });

    return response.data;
  } catch (error: any) {
    // Extract meaningful error message from response
    if (error.response?.data) {
      const errorData = error.response.data;

      // Use the server-provided message if available
      if (errorData.message) {
        throw new Error(errorData.message);
      }

      // Fallback to status text
      if (error.response.statusText) {
        throw new Error(error.response.statusText);
      }
    }

    // Fallback to generic error
    throw new Error(error.message || "Request failed");
  }
};

const rootApiService = {
  get: <T>(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>,
    options?: RequestOptions,
  ) => requestAxios<T>("GET", url, { params, headers, ...options }),

  post: <T>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    options?: RequestOptions,
  ) => requestAxios<T>("POST", url, { body, headers, ...options }),

  put: <T>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    options?: RequestOptions,
  ) => requestAxios<T>("PUT", url, { body, headers, ...options }),

  delete: <T>(
    url: string,
    headers?: Record<string, string>,
    options?: RequestOptions,
  ) => requestAxios<T>("DELETE", url, { headers, ...options }),

  patch: <T>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    options?: RequestOptions,
  ) => requestAxios<T>("PATCH", url, { body, headers, ...options }),
  postBlob: async (
    url: string,
    body?: any,
    headers?: Record<string, string>,
    options: RequestOptions = {},
  ): Promise<Blob> => {
    const { timeout = API_ROUTES.TIMEOUT, skipAuth = false } = options;
    const finalHeaders = {
      ...headers,
      ...(skipAuth ? { "x-skip-auth": "true" } : {}),
      Accept: "application/pdf",
      "Content-Type": "application/json",
    } as Record<string, string>;

    // Determine if this is a payment endpoint
    const isPaymentEndpoint =
      url.includes("/payments") || url.includes("/payment-methods");
    const baseURL = isPaymentEndpoint
      ? API_ROUTES.PAYMENT_BASE_URL
      : API_ROUTES.BASE_URL;

    const response = await axiosInstance.request<Blob>({
      url,
      method: "POST",
      headers: finalHeaders,
      data: body,
      timeout,
      responseType: "blob",
      baseURL, // Override base URL for payment endpoints
    });
    return response.data as any;
  },
};

export default rootApiService;
