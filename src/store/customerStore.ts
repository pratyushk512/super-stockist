import { create } from "zustand";
import { Customer } from "@/types/types";

interface CustomersState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  getAllCustomers: () => Customer[];
  getCustomerById: (customerId: string) => Customer | undefined;
  getCustomerByPhone: (phone: number) => Customer[];
}

export const useCustomerStore = create<CustomersState>((set, get) => ({
    customers: [],
    isLoading: false,
    error: null,

  fetchCustomers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/customers/get-all-customers");
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      set({ customers: data.customers, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false 
      });
    }
  },

  getAllCustomers: () => get().customers,

  getCustomerById: (customerId: string) =>
    get().customers.find((cust) => cust._id === customerId),

  getCustomerByPhone: (phone: number) =>
    get().customers.filter((cust) => cust.phone === phone),
}));