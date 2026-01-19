import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { budgetService } from '../api/budgetService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import BudgetBar from '../components/BudgetBar';

export default function BudgetPage() {
  const { user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadBudget();
  }, [user]);

  async function loadBudget() {
    try {
      const data = await budgetService.getBudget();
      if (data.budget) {
        setBudget(data.budget.amount);
        setAmount(data.budget.amount.toString());
      }
    } catch (_) {}
  }

  async function handleSave(e) {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return setMsg('Please enter a valid amount');
    try {
      await budgetService.setBudget(num);
      setBudget(num);
      setMsg('Budget saved!');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="page">
      <h1>Budget Planner</h1>
      <p className="page-subtitle">Set a budget to help manage your spending on ShopSmart.</p>

      {msg && <p className="flash-msg">{msg}</p>}

      <form onSubmit={handleSave} className="budget-form">
        <div className="form-group">
          <label>Monthly Budget (£)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="e.g. 150.00"
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Budget</button>
      </form>

      {budget && (
        <div className="budget-status">
          <h3>Current Status</h3>
          <BudgetBar budget={budget} cartTotal={cart.total} />
        </div>
      )}
    </div>
  );
}
