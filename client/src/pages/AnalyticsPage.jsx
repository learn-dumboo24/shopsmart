import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../api/analyticsService';
import { useAuth } from '../context/AuthContext';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [ecoStats, setEcoStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user]);

  async function loadData() {
    try {
      const [s, eco, top] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getEcoStats(),
        analyticsService.getTopProducts(),
      ]);
      setSummary(s);
      setEcoStats(eco);
      setTopProducts(top.topProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="page">
      <h1>Analytics Dashboard</h1>
      <p className="page-subtitle">A simple overview of store activity.</p>

      {loading && <p>Loading analytics...</p>}

      {summary && (
        <div className="analytics-grid">
          <div className="stat-card">
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{summary.totalOrders}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">£{summary.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{summary.totalUsers}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Products</p>
            <p className="stat-value">{summary.totalProducts}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Eco Products</p>
            <p className="stat-value">{summary.ecoProductPercent}%</p>
          </div>
          {summary.topCategory && (
            <div className="stat-card">
              <p className="stat-label">Top Category</p>
              <p className="stat-value">{summary.topCategory.name}</p>
            </div>
          )}
        </div>
      )}

      {ecoStats && (
        <div className="analytics-section">
          <h2>Eco Stats</h2>
          <div className="analytics-table">
            <div className="table-row">
              <span>Eco Products</span><span>{ecoStats.ecoProductCount}</span>
            </div>
            <div className="table-row">
              <span>Non-Eco Products</span><span>{ecoStats.nonEcoProductCount}</span>
            </div>
            <div className="table-row">
              <span>Eco Revenue</span><span>£{ecoStats.ecoRevenue.toFixed(2)}</span>
            </div>
            <div className="table-row">
              <span>Non-Eco Revenue</span><span>£{ecoStats.nonEcoRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {topProducts.length > 0 && (
        <div className="analytics-section">
          <h2>Top Products by Orders</h2>
          <div className="analytics-table">
            <div className="table-row table-header">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Orders</span>
            </div>
            {topProducts.map(p => (
              <div key={p.id} className="table-row">
                <span>{p.name}</span>
                <span>{p.category}</span>
                <span>£{p.price.toFixed(2)}</span>
                <span>{p.orderCount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary && (
        <div className="analytics-section">
          <h2>Orders by Status</h2>
          <div className="analytics-table">
            {Object.entries(summary.statusBreakdown).map(([status, count]) => (
              <div key={status} className="table-row">
                <span>{status}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
