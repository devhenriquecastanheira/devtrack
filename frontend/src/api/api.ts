import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  ACCESS_TOKEN_KEY,
  AUTH_SESSION_EXPIRED_EVENT,
  REFRESH_TOKEN_KEY,
} from '../constants/auth';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function notifySessionExpired() {
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
}

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      clearAuthStorage();
      notifySessionExpired();

      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;

      const response = await axios.post<{ access: string }>(
        'http://localhost:8000/api/users/token/refresh/',
        {
          refresh: refreshToken,
        },
      );

      const newAccessToken = response.data.access;

      localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      notifySessionExpired();

      return Promise.reject(refreshError);
    }
  },
);