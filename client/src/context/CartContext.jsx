import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../api/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  // Refresh cart whenever user changes
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [user]);

  async function refreshCart() {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(productId, quantity = 1) {
    await cartService.addToCart(productId, quantity);
    await refreshCart();
  }

  async function removeItem(productId) {
    await cartService.removeFromCart(productId);
    await refreshCart();
  }

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addItem, removeItem, refreshCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
