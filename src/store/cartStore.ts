import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  cartItemId: string;
  name: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
  selectedAttributes?: Record<string, string>;
};

// Genera un id estable combinando producto + atributos
export const buildCartItemId = (
  id: number,
  selectedAttributes?: Record<string, string>
): string => {
  const attrs = selectedAttributes
    ? Object.entries(selectedAttributes)
        .sort(([a], [b]) => a.localeCompare(b)) // orden estable
        .map(([k, v]) => `${k}:${v}`)
        .join("|")
    : "";
  return attrs ? `${id}-${attrs}` : String(id);
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Omit<CartItem, "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;        // ← string
  updateQuantity: (cartItemId: string, quantity: number) => void; // ← string
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
        const cartItemId = buildCartItemId(product.id, product.selectedAttributes);
        const items = get().items;
        const existing = items.find((i) => i.cartItemId === cartItemId);

        if (existing) {
          set({
            items: items.map((i) =>
              i.cartItemId === cartItemId
                ? { ...i, quantity: i.quantity + product.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, cartItemId }] });
        }
        set({ isOpen: true });
      },

      removeItem: (cartItemId) =>
        set({ items: get().items.filter((i) => i.cartItemId !== cartItemId) }),

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { name: "cart-storage" }
  )
);