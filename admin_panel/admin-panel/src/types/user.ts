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
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  phone?: string;
}