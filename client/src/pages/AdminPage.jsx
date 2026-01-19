import { useState, useEffect } from 'react';
import { orderService } from '../api/orderService';
import { productService } from '../api/productService';

// Basic admin view - no auth guard on purpose (student level)
// In production: add admin-only middleware
export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  async function loadOrders() {
    try {
      const data = await orderService.getOrders();
      setOrders(data.orders);
    } catch (_) {}
  }

  async function loadProducts() {
    try {
      const data = await productService.getProducts();
      setProducts(data.products);
    } catch (_) {}
  }

  return (
    <div className="page">
      <h1>Admin Panel</h1>
      <p className="page-subtitle">Simple overview of orders and products.</p>

      <div className="tabs">
        <button
          className={`tab ${tab === 'orders' ? 'active' : ''}`}
          onClick={() => setTab('orders')}
        >
          Orders ({orders.length})
        </button>
        <button
          className={`tab ${tab === 'products' ? 'active' : ''}`}
          onClick={() => setTab('products')}
        >
          Products ({products.length})
        </button>
      </div>

      {tab === 'orders' && (
        <div className="analytics-table">
          <div className="table-row table-header">
            <span>Order ID</span>
            <span>User ID</span>
            <span>Status</span>
            <span>Total</span>
          </div>
          {orders.length === 0 && <p className="empty-state">No orders yet.</p>}
          {orders.map(o => (
            <div key={o.id} className="table-row">
              <span>{o.id.slice(0, 8)}...</span>
              <span>{o.userId.slice(0, 8)}...</span>
              <span>{o.status}</span>
              <span>£{o.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'products' && (
        <div className="analytics-table">
          <div className="table-row table-header">
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Eco</span>
          </div>
          {products.map(p => (
            <div key={p.id} className="table-row">
              <span>{p.name}</span>
              <span>{p.category}</span>
              <span>£{p.price.toFixed(2)}</span>
              <span>{p.stock}</span>
              <span>{p.ecoFriendly ? '🌿' : '—'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
