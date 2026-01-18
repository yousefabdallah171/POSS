import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
  total: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: { id: number; name: string; price: number; image?: string }) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateNotes: (productId: number, notes: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

/**
 * Zustand cart store with localStorage persistence
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.productId === product.id);

          if (existingItem) {
            // Increase quantity - create new array with updated item
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                      total: (item.quantity + 1) * item.price,
                    }
                  : item
              ),
            };
          } else {
            // Add new item - return new state
            return {
              items: [
                ...state.items,
                {
                  id: Date.now(),
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: product.image,
                  total: product.price,
                },
              ],
            };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity,
                  total: quantity * item.price,
                }
              : item
          ),
        }));
      },

      updateNotes: (productId, notes) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  notes,
                }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.total, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

/**
 * Optimized selectors to prevent unnecessary re-renders
 * Use these selectors instead of the entire store in components
 */
export const selectCartItems = (state: CartStore) => state.items;
export const selectCartTotal = (state: CartStore) => state.getTotal();
export const selectCartItemsCount = (state: CartStore) => state.getTotalItems();
export const selectCartItemByProductId = (productId: number) => (state: CartStore) =>
  state.items.find((item) => item.productId === productId);
