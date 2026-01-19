import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../api/orderService';
import { budgetService } from '../api/budgetService';
import CartItem from '../components/CartItem';
import BudgetBar from '../components/BudgetBar';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, removeItem, refreshCart } = useCart();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [msg, setMsg] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadBudget();
  }, [user]);

  async function loadBudget() {
    try {
      const data = await budgetService.getBudget();
      if (data.budget) setBudget(data.budget.amount);
    } catch (_) {}
  }

  async function handlePlaceOrder() {
    if (cart.items.length === 0) return setMsg('Your cart is empty');
    setPlacing(true);
    try {
      const items = cart.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
      }));
      await orderService.placeOrder(items);
      await refreshCart();
      navigate('/orders');
    } catch (err) {
      setMsg(err.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  }

  if (!user) return null;

  return (
    <div className="page">
      <h1>Your Cart</h1>
      {msg && <p className="error-msg">{msg}</p>}

      {budget && <BudgetBar budget={budget} cartTotal={cart.total} />}

      {cart.items.length === 0 ? (
        <p className="empty-state">Your cart is empty. <a href="/products">Shop now →</a></p>
      ) : (
        <>
          <div className="cart-list">
            {cart.items.map(item => (
              <CartItem key={item.productId} item={item} onRemove={removeItem} />
            ))}
          </div>
          <div className="cart-summary">
            <p className="cart-total">Total: <strong>£{cart.total.toFixed(2)}</strong></p>
            <button
              className="btn btn-primary"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? 'Placing...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
