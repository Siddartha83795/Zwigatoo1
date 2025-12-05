"use client";

import type { CartItem, MenuItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  outletId: string | null;
  setOutletId: (id: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [outletId, setOutletIdState] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('dinehub_cart');
      const storedOutletId = localStorage.getItem('dinehub_outletId');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      if (storedOutletId) {
        setOutletIdState(storedOutletId);
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dinehub_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
    }
  }, [cart]);
  
  const setOutletId = useCallback((id: string | null) => {
    if (outletId && id && outletId !== id && cart.length > 0) {
      if (window.confirm('You have items from another outlet. Starting a new cart will clear your current one. Do you want to continue?')) {
        setCart([]);
        setOutletIdState(id);
        localStorage.setItem('dinehub_outletId', id || '');
      }
    } else {
      setOutletIdState(id);
      localStorage.setItem('dinehub_outletId', id || '');
    }
  }, [cart.length, outletId]);

  const addToCart = useCallback((menuItem: MenuItem, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.menuItem.id === menuItem.id
      );
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, { menuItem, quantity }];
      }
      return newCart;
    });
    toast({
        title: "Item Added",
        description: `${menuItem.name} has been added to your cart.`,
    })
  }, [toast]);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.menuItem.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.menuItem.id !== itemId);
      }
      return prevCart.map((item) =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.menuItem.priceInr * item.quantity,
        0
      ),
    [cart]
  );
  
  const itemCount = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cart]
  );

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
    outletId,
    setOutletId
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount, outletId, setOutletId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
