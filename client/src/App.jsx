import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import BudgetPage from './pages/BudgetPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/products" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<div className="page"><h2>404 — Page not found</h2></div>} />
            </Routes>
          </main>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
