const products = require('../data/products');

function getAll() {
  return products;
}

function getById(id) {
  const product = products.find(p => p.id === id);
  if (!product) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  return product;
}

// filter by category and/or eco-friendly flag
function filter({ category, eco, search }) {
  let result = [...products];

  if (category) {
    result = result.filter(p => p.category === category.toLowerCase());
  }

  if (eco === 'true' || eco === true) {
    result = result.filter(p => p.ecoFriendly === true);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  return result;
}

// Compare similar products in same category (for price comparison widget)
function compareByCategory(productId) {
  const product = getById(productId);
  return products
    .filter(p => p.category === product.category && p.id !== productId)
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);
}

module.exports = { getAll, getById, filter, compareByCategory };
