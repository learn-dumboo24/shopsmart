import { useState, useEffect } from 'react';
import { productService } from '../api/productService';
import { wishlistService } from '../api/wishlistService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['all', 'electronics', 'clothing', 'footwear', 'accessories', 'sports', 'home', 'beauty'];

export default function ProductsPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ category: '', eco: '', search: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadProducts();
  }, [filters]);

  async function loadProducts() {
    setLoading(true);
    setError('');
    try {
      const data = await productService.getProducts(filters);
      setProducts(data.products);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart(productId) {
    if (!user) return setMsg('Please login to add to cart');
    try {
      await addItem(productId, 1);
      setMsg('Added to cart!');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function handleAddToWishlist(productId) {
    if (!user) return setMsg('Please login to use wishlist');
    try {
      await wishlistService.addToWishlist(productId);
      setMsg('Added to wishlist!');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="page">
      <h1>Products</h1>

      {msg && <p className="flash-msg">{msg}</p>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className="search-input"
        />
        <select
          value={filters.category}
          onChange={e => setFilters({ ...filters, category: e.target.value === 'all' ? '' : e.target.value })}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c === 'all' ? '' : c}>{c}</option>
          ))}
        </select>
        <label className="eco-toggle">
          <input
            type="checkbox"
            checked={filters.eco === 'true'}
            onChange={e => setFilters({ ...filters, eco: e.target.checked ? 'true' : '' })}
          />
          🌿 Eco-Friendly Only
        </label>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="error-msg">{error}</p>}

      <p className="result-count">{products.length} product{products.length !== 1 ? 's' : ''} found</p>

      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        ))}
      </div>

      {!loading && products.length === 0 && (
        <p className="empty-state">No products match your filters.</p>
      )}
    </div>
  );
}
