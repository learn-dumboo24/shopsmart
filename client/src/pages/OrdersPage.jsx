import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../api/orderService';
import { useAuth } from '../context/AuthContext';
import OrderTracker from '../components/OrderTracker';

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user]);

  async function loadOrders() {
    try {
      const data = await orderService.getOrders();
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="page">
      <h1>My Orders</h1>

      {loading && <p>Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <p className="empty-state">No orders yet. <Link to="/products">Start shopping →</Link></p>
      )}

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">Order #{order.id.slice(0, 8)}</span>
              <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
              <span className="order-total">£{order.total.toFixed(2)}</span>
            </div>
            <OrderTracker status={order.status} />
            <div className="order-items">
              {order.items.map(item => (
                <p key={item.productId} className="order-item-row">
                  {item.name} × {item.quantity} — £{item.subtotal.toFixed(2)}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
