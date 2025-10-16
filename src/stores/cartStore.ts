import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartProduct } from '@/types';

interface CartState {
  items: CartProduct[];
  setItems: (items: CartProduct[]) => void;
  getItems: () => CartProduct[];
  addItem: (item: CartProduct) => void;
  removeItem: (productId: string) => void;
  updateTitle: (productId: string, newTitle: string) => void;
  updatePrice: (productId: string, newPrice: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (cart_products: CartProduct[]) => {
        set({ items: cart_products });
      },
      getItems: () => {
        return get().items;
      },
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity_in_cart: i.quantity_in_cart + item.quantity_in_cart }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) => {
        console.log('Removing item:', productId);
        return set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      updateTitle: (productId, newTitle) => {
        console.log('Updating title:', productId, newTitle);
        return set((state) => ({
          items: state.items.map((item) => {
            return item.id === productId ? { ...item, title: newTitle } : item;
          }),
        }));
      },
      updatePrice: (productId, newPrice) => {
        console.log('Updating price:', productId, newPrice);
        return set((state) => ({
          items: state.items.map((item) => {
            return item.id === productId ? { ...item, price: newPrice } : item;
          }),
        }));
      },
      updateQuantity: (productId, quantity) => {
        console.log('Updating quantity:', productId, quantity);
        return set((state) => ({
          items: state.items.map((item) => {
            return item.id === productId ? { ...item, quantity_in_cart: quantity } : item;
          }),
        }));
      },
      clearCart: () => {
        console.log('Clearing cart');
        return set({ items: [] });
      },
      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity_in_cart, 0);
      },
      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity_in_cart, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
