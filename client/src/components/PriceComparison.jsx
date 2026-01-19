import { Link } from 'react-router-dom';
import EcoBadge from './EcoBadge';

// Price comparison widget - shows similar products side by side
export default function PriceComparison({ similar, currentPrice }) {
  if (!similar || similar.length === 0) return null;

  return (
    <div className="price-comparison">
      <h3>Compare Similar Products</h3>
      <div className="comparison-table">
        <div className="comparison-header">
          <span>Product</span>
          <span>Price</span>
          <span>Rating</span>
          <span></span>
        </div>
        {similar.map(product => {
          const isBetter = product.price < currentPrice;
          return (
            <div key={product.id} className={`comparison-row ${isBetter ? 'better-value' : ''}`}>
              <div className="comparison-name">
                {product.name}
                {product.ecoFriendly && <EcoBadge />}
                {isBetter && <span className="best-value-tag">Best Value</span>}
              </div>
              <span className="comparison-price">£{product.price.toFixed(2)}</span>
              <span>⭐ {product.rating}</span>
              <Link to={`/products/${product.id}`} className="btn btn-sm btn-outline">View</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
