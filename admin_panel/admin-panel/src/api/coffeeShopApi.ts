import { api } from "./api";

export interface CoffeeShop {
  id: number;
  adress: string;
  open: string;
  close: string;
  isActive: boolean;
}

export const getCoffeeShop = async () => {
  const res = await api.get("/CoffeeShop");

  return res.data[0];
};

export const updateCoffeeShop = async (
  data: Omit<CoffeeShop, "id">
) => {
  const res = await api.put(
    "/CoffeeShop",
    data
  );

  return res.data;
};