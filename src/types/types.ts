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

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  currStock: number;
  unitsPerBox: number;
  unitsSold: number;
};

export type Customer = {
  _id: string;
  salesmanId: string;
  customerName: string;
  phone: number;
  email: string;
  address: string;
  unicode: string;
};