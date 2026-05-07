export type User = {
  id: number;
  username: string;
  email: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};