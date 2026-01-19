import { Link } from 'react-router-dom';
import EcoBadge from './EcoBadge';

export default function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  return (
    <div className="product-card">
      <div className="product-img-placeholder">
        {product.category.slice(0, 2).toUpperCase()}
      </div>
      <div className="product-info">
        <div className="product-header">
          <h3>
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          {product.ecoFriendly && <EcoBadge />}
        </div>
        <p className="product-price">£{product.price.toFixed(2)}</p>
        <p className="product-category">{product.category}</p>
        <p className="product-rating">⭐ {product.rating} ({product.reviews} reviews)</p>
        <p className="product-stock">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </div>
      <div className="product-actions">
        <button
          className="btn btn-primary"
          onClick={() => onAddToCart && onAddToCart(product.id)}
          disabled={product.stock === 0}
        >
          Add to Cart
        </button>
        <button
          className="btn btn-outline"
          onClick={() => onAddToWishlist && onAddToWishlist(product.id)}
        >
          ♡ Wishlist
        </button>
      </div>
    </div>
  );
}
