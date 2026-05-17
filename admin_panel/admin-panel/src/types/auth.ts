export type UserRole = "admin" | "barista" | "user";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  bonusBalance: number;
  token: string;
  expiresAt: string;
}