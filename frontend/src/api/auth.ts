import { api } from './api';
import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/auth';

export async function login(data: LoginRequest) {
  const response = await api.post<AuthTokens>('/users/login/', data);
  return response.data;
}

export async function register(data: RegisterRequest) {
  const response = await api.post<User>('/users/register/', data);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get<User>('/users/me/');
  return response.data;
}