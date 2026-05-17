export interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
  isActive?: boolean;
}