import { create } from "zustand";
import { Order } from "@/types/types";

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  getAllOrders: () => Order[];
  getOrderById: (orderNumber: number) => Order | undefined;
  getOrdersByCustomerId: (customerId: string) => Order[];
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/orders/get-all-orders");
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      set({ orders: data.orders, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false 
      });
    }
  },

  getAllOrders: () => get().orders,

  getOrderById: (orderNo: number) =>
    get().orders.find((order) => order.orderNo === orderNo),

  getOrdersByCustomerId: (customerId: string) =>
    get().orders.filter((order) => order.customerId === customerId),
}));