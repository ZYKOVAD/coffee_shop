import { api } from "./api";

export type UserRole =
  | "admin"
  | "barista"
  | "user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  bonusBalance: number;
  token: string;
  expiresAt: string;
}

export const loginRequest = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/Auth/login",
    data
  );

  return response.data;
};