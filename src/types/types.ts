export type OrderItem = {
  productId: string;
  quantity: number;
  priceAtTime: number;
  total: number;
};

export type OrderStatus = "pending" | "packed" | "paid" | "cancelled";

export type Order = {
  customerId: string;
  customerName: string;
  orderNumber: number;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdBy: {
    name: string;
    userType: string;
  };
};
