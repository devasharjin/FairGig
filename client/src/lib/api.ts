import axios, { type AxiosRequestConfig } from "axios";
import { env } from "./env";
import type { ApiEnvelope } from "./types";
import { useAuthStore } from "@/features/auth/store";

const api = axios.create({
  baseURL: env.backendUrl,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("refresh-token") &&
      !originalRequest.url?.includes("login") &&
      !originalRequest.url?.includes("register")
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${env.backendUrl}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (err) {
        useAuthStore.getState().setUser(null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

function extractErrorMessage(error: any): string {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.message ||
    error?.message ||
    "Request failed"
  );
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await api.get<ApiEnvelope<T>>(url, config);
    if (response.data.success === false || response.data.status === "error") {
      throw new Error(response.data.message || "Request failed");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function apiPost<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  try {
    const response = await api.post<ApiEnvelope<TResponse>>(url, body, config);
    if (response.data.success === false || response.data.status === "error") {
      throw new Error(response.data.message || "Request failed");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function apiPut<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  try {
    const response = await api.put<ApiEnvelope<TResponse>>(url, body, config);
    if (response.data.success === false || response.data.status === "error") {
      throw new Error(response.data.message || "Request failed");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function apiPatch<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  try {
    const response = await api.patch<ApiEnvelope<TResponse>>(url, body, config);
    if (response.data.success === false || response.data.status === "error") {
      throw new Error(response.data.message || "Request failed");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function apiDelete<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
  try {
    const response = await api.delete<ApiEnvelope<TResponse>>(url, config);
    if (response.data.success === false || response.data.status === "error") {
      throw new Error(response.data.message || "Request failed");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}