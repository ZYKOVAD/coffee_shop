import { api } from "./api";

import type { User } from "../types/user";

export const getUsers = async (): Promise<User[]> => {
  const response =
    await api.get<User[]>("/Users");

  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await api.get(`/Users/${id}`);
  return response.data;
};

export interface Barista {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface CreateBaristaDto {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface UpdateBaristaDto {
  username?: string;
  email?: string;
  phone?: string;
}

export const getBaristas = async (): Promise<Barista[]> => {
  const response = await api.get("/Admin/users/baristas");
  return response.data;
};

export const createBarista = async (data: CreateBaristaDto) => {
  const response = await api.post("/Admin/barista", data);
  return response.data;
};

export const updateBarista = async (id: number, data: UpdateBaristaDto) => {
  const response = await api.put(`/Users/${id}`, data);
  return response.data;
};

export const deleteBarista = async (id: number) => {
  await api.delete(`/Users/${id}`);
};