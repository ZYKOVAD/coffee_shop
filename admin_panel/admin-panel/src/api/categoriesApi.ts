import { api } from "./api";

import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../types/category";

export const getCategories = async (): Promise<Category[]> => {
  const response =
    await api.get<Category[]>("/Categories");

  return response.data;
};

export const getCategoryById = async (
  id: number
): Promise<Category> => {
  const response =
    await api.get<Category>(
      `/Categories/${id}`
    );

  return response.data;
};

export const createCategory = async (
  data: CreateCategoryDto
) => {
  const response =
    await api.post("/Categories", data);

  return response.data;
};

export const updateCategory = async (
  id: number,
  data: UpdateCategoryDto
) => {
  await api.put(`/Categories/${id}`, data);
};

export const deleteCategory = async (
  id: number
) => {
  await api.delete(`/Categories/${id}`);
};