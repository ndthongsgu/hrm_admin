import { API_ROUTES } from "@/services";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_ROUTES.BASE_URL,
  timeout: API_ROUTES.TIMEOUT,
  headers: API_ROUTES.HEADERS,
});

const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === "true";

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (BYPASS_AUTH) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${API_ROUTES.BASE_URL}/api/auth/refresh`,
            {
              refreshToken,
            }
          );

          const { token } = response.data;
          localStorage.setItem("token", token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        if (!BYPASS_AUTH) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export const apiRequest = {
  get: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.get(url, config),

  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.post(url, data, config),

  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.put(url, data, config),

  patch: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.patch(url, data, config),

  delete: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.delete(url, config),
};

export default apiClient;
