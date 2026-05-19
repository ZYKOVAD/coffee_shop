export interface OrderItem {
  id: number;
  productName: string;
  count: number;
  price: number;
  totalPrice: number;
  selectedModifiers?: string;
}

export interface Order {
  id: number;
  userId: number;
  userName: string;
  email: string;
  status: string;
  totalPrice: number;
  bonusUsed: number;
  bonusEarned: number;
  baristaComment: string,
  clientComment: string,
  pickupTime: string;
  createdAt: string;
  orderNumber: number;
  items: OrderItem[];
}