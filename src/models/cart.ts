export interface CartItem {
    itemId: string;
    quantity: number;
  }
  
  export interface Cart {
    userId: string;
    items: CartItem[];
  }