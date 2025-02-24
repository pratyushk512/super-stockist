export type OrderItem={
  productId: string;
  productName: string;
  hsn: string;
  quantity: number;
  priceAtTime: string;
  total: string;
};

export type OrderStatus = "pending" | "approved" | "dispatched" | "cancelled";

export type PaymentStatus = "pending" | "paid" | "cancelled";

export type Order = {
  customerId: string;
  customerName: string;
  orderNo: number;
  invoiceNo: number;
  orderDate: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
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
  hsn: string;
  description: string;
  price: string;
  category: string;
  currStock: number;
  unitsPerBox: number;
  unitsSold: number;
  image: string;
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