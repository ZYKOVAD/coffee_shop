import { api } from "./api";

export interface DashboardStats {
  usersCount: number;
  productsCount: number;
  categoriesCount: number;
  ordersCount: number;
}

export const getDashboardStats =
  async (): Promise<DashboardStats> => {
    const response = await api.get(
      "/Dashboard/stats"
    );

    return response.data;
  };