import { api } from "./api";
import type { Order } from "../types/order";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled"
  | "rejected"
  | "notPickedUp"

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  baristaComment?: string;
}

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>("/Orders");
  return response.data;
};

export const updateOrderStatus = async (
  orderId: number,
  data: UpdateOrderStatusRequest
) => {
  await api.put(
    `/Orders/${orderId}/status`,
    data
  );
};