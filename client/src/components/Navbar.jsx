import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🛒 ShopSmart</Link>
      </div>
      <div className="navbar-links">
        <Link to="/products">Products</Link>
        {user && (
          <>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/budget">Budget</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/cart" className="cart-link">
              Cart {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
          </>
        )}
      </div>
      <div className="navbar-auth">
        {user ? (
          <div className="user-info">
            <span>Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} className="btn btn-sm">Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
