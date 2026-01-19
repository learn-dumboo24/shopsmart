const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const budgetRoutes = require('./routes/budget.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health Check Route
app.get('/api/health', (req, res) => {
  logger.info('Health check requested');
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Root Route
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Route not found' });
});

// Centralised error handler (must be last)
app.use(errorHandler);

module.exports = app;
