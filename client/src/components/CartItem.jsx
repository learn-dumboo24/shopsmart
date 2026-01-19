export default function CartItem({ item, onRemove }) {
  const { product, quantity } = item;

  if (!product) return null;

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <p className="cart-item-name">{product.name}</p>
        <p className="cart-item-price">£{product.price.toFixed(2)} × {quantity}</p>
      </div>
      <div className="cart-item-right">
        <p className="cart-item-subtotal">£{(product.price * quantity).toFixed(2)}</p>
        <button className="btn btn-danger btn-sm" onClick={() => onRemove(product.id)}>
          Remove
        </button>
      </div>
    </div>
  );
}
