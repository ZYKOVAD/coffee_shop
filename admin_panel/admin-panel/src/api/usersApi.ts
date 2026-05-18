import { api } from "./api";

import type { User, CreateUserDto, UpdateUserDto  } from "../types/user";

export const getUsers = async (): Promise<User[]> => {
  const response =
    await api.get<User[]>("/Users");

  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await api.get(`/Users/${id}`);
  return response.data;
};

export const createBarista = async (data: CreateUserDto) => {
  const response = await api.post("/Admin/barista", data);
  return response.data;
};

export const updateBarista = async (id: number, data: UpdateUserDto) => {
  const response = await api.put(`/Users/${id}`, data);
  return response.data;
};

export const deleteBarista = async (id: number) => {
  await api.delete(`/Users/${id}`);
};