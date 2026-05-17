import { api } from "./api";
import type { Order } from "../types/order";

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>("/Orders");
  return response.data;
};