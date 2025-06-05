import { create } from "zustand";

interface PaymentState {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>;
}

interface Payment {
    _id: string
    paymentDate: string
    mode: string
    invoiceId: string
    amount: number
    status: "Pending" | "Verified"
    salesmanId: string
    salesmanName: string
  }
export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  isLoading: false,
  error: null,
  fetchPayments: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/payments/get-all-payments");
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data = await response.json();
      set({ payments: data.payments, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch payments',
        isLoading: false 
      });
    }
  },
}));