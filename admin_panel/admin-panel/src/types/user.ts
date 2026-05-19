export interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  bonusBalance: number;
  role: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  phone?: string;
  role: string;
}