import { create } from "zustand";
import { Product } from "@/types/types";

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getAllProducts: () => Product[];

}

export const useProductStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/products/get-all-products");
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      set({ products: data.products, isLoading: false });


    } catch (error) {
      console.error("Failed to fetch products:", error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false 
      });
    }
  },

  getAllProducts: () => get().products,

  
}));