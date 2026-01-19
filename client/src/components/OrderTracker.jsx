const STEPS = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderTracker({ status }) {
  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="order-tracker">
      {STEPS.map((step, index) => {
        const done = index <= currentIndex;
        const active = index === currentIndex;
        return (
          <div key={step} className={`tracker-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <div className="tracker-dot">{done ? '✓' : index + 1}</div>
            <p className="tracker-label">{step}</p>
            {index < STEPS.length - 1 && (
              <div className={`tracker-line ${done ? 'done' : ''}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
