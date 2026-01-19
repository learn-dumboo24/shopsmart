export default function BudgetBar({ budget, cartTotal }) {
  if (!budget) return null;

  const percent = Math.min((cartTotal / budget) * 100, 100);
  const exceeded = cartTotal > budget;
  const remaining = (budget - cartTotal).toFixed(2);

  return (
    <div className="budget-bar">
      <div className="budget-bar-header">
        <span>Budget: £{budget.toFixed(2)}</span>
        <span className={exceeded ? 'over-budget' : 'under-budget'}>
          {exceeded
            ? `Over by £${Math.abs(remaining)}`
            : `£${remaining} remaining`}
        </span>
      </div>
      <div className="budget-bar-track">
        <div
          className={`budget-bar-fill ${exceeded ? 'exceeded' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
