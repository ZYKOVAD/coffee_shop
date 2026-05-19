import { api } from "./api";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  Modifier,
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

export async function activateProduct(id: number) {
  await api.patch(`/Products/activate/${id}`);
}

export async function deactivateProduct(id: number) {
  await api.patch(`/Products/deactivate/${id}`);
}

export const getPopularProducts = async (): Promise<Product[]> => {
  const res = await api.get("/Products/popular");
  return res.data;
};

export const makePopular = async (id: number) => {
  await api.patch(`/Products/popular/${id}`);
};

export const makeUnpopular = async (id: number) => {
  await api.patch(`/Products/unpopular/${id}`);
};

// модификаторы
export const getModifiers = async (): Promise<Modifier[]> => {
  const response =  await api.get(`/Modifiers`);
  return response.data;
};

export const addModifierToProduct = async (productId: number, modifierId: number) => {
  await api.post(`/Products/${productId}/modifiers/${modifierId}`);
};

export const removeModifierFromProduct = async (productId: number, modifierId: number) => {
  await api.delete(`/Products/${productId}/modifiers/${modifierId}`);
};

export const createModifier = async (
  data: {
    name: string;
    price: number;
  }
) => {
  const response = await api.post(`/Modifiers`, data);
  return response.data;
};

export const updateModifier = async (
  id: number,
  data: {
    name: string;
    price: number;
  }
) => {
  await api.put(`/Modifiers/${id}`, data);
};

export const deleteModifier = async (
  id: number
) => {
  await api.delete(`/Modifiers/${id}`);
};