import { Link } from 'react-router-dom';
import EcoBadge from './EcoBadge';

// "You may also like" section shown on product detail page
export default function Recommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="recommendations">
      <h3>You may also like</h3>
      <div className="reco-grid">
        {recommendations.map(product => (
          <Link to={`/products/${product.id}`} key={product.id} className="reco-card">
            <div className="reco-img">{product.category.slice(0, 2).toUpperCase()}</div>
            <div className="reco-info">
              <p className="reco-name">{product.name}</p>
              {product.ecoFriendly && <EcoBadge />}
              <p className="reco-price">£{product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
