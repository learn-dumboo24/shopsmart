const orderData = require('../data/orders');
const { getById: getProductById } = require('./product.service');
const cartService = require('./cart.service');

function placeOrder(userId, items) {
  if (!items || items.length === 0) {
    const err = new Error('Order must contain at least one item');
    err.status = 400;
    throw err;
  }

  // Enrich items and calculate total
  const enrichedItems = items.map(item => {
    const product = getProductById(item.productId); // throws 404 if invalid
    return {
      productId: item.productId,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal: parseFloat((product.price * item.quantity).toFixed(2)),
    };
  });

  const total = parseFloat(
    enrichedItems.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2)
  );

  const order = {
    id: crypto.randomUUID(),
    userId,
    items: enrichedItems,
    total,
    status: 'Order Placed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orderData.createOrder(order);
  cartService.clearCart(userId); // clear cart after placing order

  return order;
}

function getByUser(userId) {
  return orderData.findByUser(userId);
}

function getOrderById(orderId, userId) {
  const order = orderData.findById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  // Only allow user to view their own order
  if (order.userId !== userId) {
    const err = new Error('Not authorised to view this order');
    err.status = 403;
    throw err;
  }
  return order;
}

function updateStatus(orderId, newStatus) {
  const updated = orderData.updateStatus(orderId, newStatus);
  if (!updated) {
    const err = new Error('Order not found or invalid status');
    err.status = 400;
    throw err;
  }
  return updated;
}

module.exports = { placeOrder, getByUser, getOrderById, updateStatus };
