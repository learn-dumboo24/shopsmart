import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistService } from '../api/wishlistService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import EcoBadge from '../components/EcoBadge';

export default function WishlistPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [user]);

  async function loadWishlist() {
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data.wishlist);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(productId) {
    try {
      const data = await wishlistService.removeFromWishlist(productId);
      setWishlist(data.wishlist);
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function handleMoveToCart(productId) {
    try {
      await addItem(productId, 1);
      await handleRemove(productId);
      setMsg('Moved to cart!');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err.message);
    }
  }

  if (!user) return null;

  return (
    <div className="page">
      <h1>My Wishlist</h1>
      {msg && <p className="flash-msg">{msg}</p>}

      {loading && <p>Loading wishlist...</p>}

      {!loading && wishlist.length === 0 && (
        <p className="empty-state">Your wishlist is empty.</p>
      )}

      <div className="wishlist-grid">
        {wishlist.map(product => (
          <div key={product.id} className="wishlist-card">
            <div className="wishlist-img">{product.category.slice(0, 2).toUpperCase()}</div>
            <div className="wishlist-info">
              <h3>{product.name}</h3>
              {product.ecoFriendly && <EcoBadge />}
              <p className="wishlist-price">£{product.price.toFixed(2)}</p>
            </div>
            <div className="wishlist-actions">
              <button className="btn btn-primary btn-sm" onClick={() => handleMoveToCart(product.id)}>
                Move to Cart
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleRemove(product.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
