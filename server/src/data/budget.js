// In-memory budget store - keyed by userId
const budgets = {};

function getBudget(userId) {
  return budgets[userId] || null;
}

function setBudget(userId, amount) {
  budgets[userId] = { amount, createdAt: new Date().toISOString() };
  return budgets[userId];
}

module.exports = { getBudget, setBudget };
