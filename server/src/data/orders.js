// In-memory order store - swap with DB queries later
const orders = [];

function createOrder(order) {
  orders.push(order);
  return order;
}

function findByUser(userId) {
  return orders.filter(o => o.userId === userId);
}

function findById(orderId) {
  return orders.find(o => o.id === orderId);
}

function findAll() {
  return orders;
}

// Valid order statuses in sequence
const ORDER_STATUSES = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

function updateStatus(orderId, newStatus) {
  const order = findById(orderId);
  if (!order) return null;
  if (!ORDER_STATUSES.includes(newStatus)) return null;
  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  return order;
}

module.exports = { orders, createOrder, findByUser, findById, findAll, updateStatus, ORDER_STATUSES };
