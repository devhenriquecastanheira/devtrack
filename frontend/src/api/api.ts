import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('devtrack:accessToken');

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

    const refreshToken = localStorage.getItem('devtrack:refreshToken');

    if (!refreshToken) {
      localStorage.removeItem('devtrack:accessToken');
      localStorage.removeItem('devtrack:refreshToken');

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

      localStorage.setItem('devtrack:accessToken', newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('devtrack:accessToken');
      localStorage.removeItem('devtrack:refreshToken');

      return Promise.reject(refreshError);
    }
  },
);