export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imgUrl: string;
  isActive: boolean;
  categoryId: number;
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