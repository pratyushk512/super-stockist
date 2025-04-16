export type OrderItem={
  productId: string;
  productName: string;
  hsn: string;
  quantity: number;
  priceAtTime: string;
  total: string;
};

export type OrderStatus = "Pending" | "Completed" | "Cancelled";

export type PaymentStatus = "Paid" | "Unpaid";

export type Order = {
  _id: string;
  customerId: string;
  companyName: string;
  orderNo: number;
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
  ownerName: string;
  companyName: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  gstIn: string;
};

export type Invoice = {
  _id: string;
  invoiceNumber:string;
  invoiceDate:string;
  companyName:string;
  orderId: string;
  paymentStatus:PaymentStatus;
  totalAmount:string;
  gstAmount:string;
  gstPercentage:number;
}