import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
  selectedAttributes?: Record<string, string>;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        const items = get().items;
        const sameVariant = (i: CartItem) =>
          i.id === product.id &&
          JSON.stringify(i.selectedAttributes ?? {}) ===
            JSON.stringify(product.selectedAttributes ?? {});

        const existing = items.find(sameVariant);
        if (existing) {
          set({
            items: items.map((i) =>
              sameVariant(i) ? { ...i, quantity: i.quantity + product.quantity } : i
            ),
          });
        } else {
          set({ items: [...items, product] });
        }
        set({ isOpen: true });
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "cart-storage", // se guarda en localStorage
    }
  )
);