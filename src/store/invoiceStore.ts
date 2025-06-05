import { create } from "zustand";
import { Invoice } from "@/types/types";

interface InvoiceState {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  fetchInvoices: () => Promise<void>;
}

export const useInvoicesStore = create<InvoiceState>((set) => ({
  invoices: [],
  isLoading: false,
  error: null,
  fetchInvoices: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/invoices/get-all-invoices");
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data = await response.json();
      set({ invoices: data.invoices, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch invoices',
        isLoading: false 
      });
    }
  },
}));