import { CartItem } from "./cart";

export interface Order {
    orderId: string;
    userId: string;
    items: CartItem[];
    totalPrice: number;
    status: 'placed' | 'completed';
    timestamp: number;
  }