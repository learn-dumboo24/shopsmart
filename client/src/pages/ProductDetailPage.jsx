import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../api/productService';
import { wishlistService } from '../api/wishlistService';
import { recommendationService } from '../api/recommendationService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import EcoBadge from '../components/EcoBadge';
import PriceComparison from '../components/PriceComparison';
import Recommendations from '../components/Recommendations';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [recos, setRecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    setLoading(true);
    try {
      const [prod, comp, rec] = await Promise.all([
        productService.getProduct(id),
        productService.compareByCategory(id),
        recommendationService.getRecommendations(id),
      ]);
      setProduct(prod);
      setSimilar(comp.similar || []);
      setRecos(rec.recommendations || []);
    } catch (err) {
      setMsg('Product not found');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!user) return navigate('/login');
    try {
      await addItem(product.id, 1);
      setMsg('Added to cart!');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function handleAddToWishlist() {
    if (!user) return navigate('/login');
    try {
      await wishlistService.addToWishlist(product.id);
      setMsg('Added to wishlist!');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err.message);
    }
  }

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (!product) return <div className="page"><p>Product not found</p></div>;

  return (
    <div className="page">
      {msg && <p className="flash-msg">{msg}</p>}

      <div className="product-detail">
        <div className="product-detail-img">
          {product.category.slice(0, 2).toUpperCase()}
        </div>
        <div className="product-detail-info">
          <div className="product-detail-header">
            <h1>{product.name}</h1>
            {product.ecoFriendly && <EcoBadge />}
          </div>
          <p className="detail-price">£{product.price.toFixed(2)}</p>
          <p className="detail-category">Category: {product.category}</p>
          <p className="detail-rating">⭐ {product.rating} ({product.reviews} reviews)</p>
          <p className="detail-desc">{product.description}</p>
          {product.ecoFriendly && (
            <div className="eco-tags">
              {product.tags.map(t => <span key={t} className="tag">#{t}</span>)}
            </div>
          )}
          <p className="detail-stock">
            {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
          </p>
          <div className="product-detail-actions">
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button className="btn btn-outline" onClick={handleAddToWishlist}>
              ♡ Save to Wishlist
            </button>
          </div>
        </div>
      </div>

      <PriceComparison similar={similar} currentPrice={product.price} />
      <Recommendations recommendations={recos} />
    </div>
  );
}
