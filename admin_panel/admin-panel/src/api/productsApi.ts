import { api } from "./api";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from "../types/product";

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/Products");

  return response.data;
};

export const getProductById = async (
  id: number
): Promise<Product> => {
  const response = await api.get<Product>(
    `/Products/${id}`
  );

  return response.data;
};

export const createProduct = async (
  data: CreateProductDto
) => {
  const response = await api.post("/Products", data);

  return response.data;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductDto
): Promise<void> => {
  await api.put(`/Products/${id}`, data);
};

export const deleteProduct = async (
  id: number
): Promise<void> => {
  await api.delete(`/Products/${id}`);
};