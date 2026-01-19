const budgetData = require('../data/budget');
const cartService = require('./cart.service');

function getBudget(userId) {
  return budgetData.getBudget(userId);
}

function setBudget(userId, amount) {
  return budgetData.setBudget(userId, amount);
}

// Check if cart total exceeds user budget
function checkBudget(userId) {
  const budget = budgetData.getBudget(userId);
  if (!budget) {
    return { hasBudget: false };
  }

  const { total } = cartService.getCart(userId);
  const remaining = parseFloat((budget.amount - total).toFixed(2));
  const exceeded = remaining < 0;

  return {
    hasBudget: true,
    budget: budget.amount,
    cartTotal: total,
    remaining,
    exceeded,
    warningMessage: exceeded
      ? `You have exceeded your budget by £${Math.abs(remaining).toFixed(2)}`
      : null,
  };
}

module.exports = { getBudget, setBudget, checkBudget };
