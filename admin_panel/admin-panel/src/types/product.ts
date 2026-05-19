export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imgUrl: string;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  modifiers: Modifier[];
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imgUrl: string;
}

export interface UpdateProductDto {
  categoryId?: number;
  name?: string;
  description?: string;
  price?: number;
  imgUrl?: string;
  isActive?: boolean;
}

export type Modifier = {
  id: number;
  name: string;
  price: number;
  productIds: number[]
};