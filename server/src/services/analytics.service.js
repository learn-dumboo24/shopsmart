const { findAll } = require('../data/orders');
const products = require('../data/products');
const { getAllUsers } = require('../data/users');

// TODO: replace with real DB aggregation pipeline in production

function getSummary() {
  const orders = findAll();
  const users = getAllUsers();

  const totalOrders = orders.length;
  const totalRevenue = parseFloat(
    orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)
  );

  // Category breakdown
  const categoryCount = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + item.quantity;
      }
    });
  });

  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];

  // Eco stats
  const ecoProducts = products.filter(p => p.ecoFriendly).length;
  const ecoPercent = parseFloat(((ecoProducts / products.length) * 100).toFixed(1));

  // Orders by status
  const statusBreakdown = {};
  orders.forEach(o => {
    statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1;
  });

  return {
    totalOrders,
    totalRevenue,
    totalUsers: users.length,
    totalProducts: products.length,
    topCategory: topCategory ? { name: topCategory[0], units: topCategory[1] } : null,
    ecoProductPercent: ecoPercent,
    categoryBreakdown: categoryCount,
    statusBreakdown,
  };
}

function getTopProducts() {
  // Get top 5 products by number of orders
  const productOrderCount = {};
  const orders = findAll();

  orders.forEach(order => {
    order.items.forEach(item => {
      productOrderCount[item.productId] = (productOrderCount[item.productId] || 0) + item.quantity;
    });
  });

  return products
    .map(p => ({ ...p, orderCount: productOrderCount[p.id] || 0 }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5);
}

function getEcoStats() {
  const ecoProducts = products.filter(p => p.ecoFriendly);
  const nonEcoProducts = products.filter(p => !p.ecoFriendly);

  const orders = findAll();
  let ecoRevenue = 0;
  let nonEcoRevenue = 0;

  orders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        if (product.ecoFriendly) {
          ecoRevenue += product.price * item.quantity;
        } else {
          nonEcoRevenue += product.price * item.quantity;
        }
      }
    });
  });

  return {
    ecoProductCount: ecoProducts.length,
    nonEcoProductCount: nonEcoProducts.length,
    ecoRevenue: parseFloat(ecoRevenue.toFixed(2)),
    nonEcoRevenue: parseFloat(nonEcoRevenue.toFixed(2)),
    ecoCategories: [...new Set(ecoProducts.map(p => p.category))],
  };
}

module.exports = { getSummary, getTopProducts, getEcoStats };
