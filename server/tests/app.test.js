const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('should return 200 and status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /api/products', () => {
  it('should return list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it('should filter eco-friendly products', async () => {
    const res = await request(app).get('/api/products?eco=true');
    expect(res.statusCode).toEqual(200);
    res.body.products.forEach(p => {
      expect(p.ecoFriendly).toBe(true);
    });
  });

  it('should filter by category', async () => {
    const res = await request(app).get('/api/products?category=electronics');
    expect(res.statusCode).toEqual(200);
    res.body.products.forEach(p => {
      expect(p.category).toBe('electronics');
    });
  });
});

describe('GET /api/products/:id', () => {
  it('should return a single product', async () => {
    const res = await request(app).get('/api/products/p1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 'p1');
  });

  it('should return 404 for unknown product', async () => {
    const res = await request(app).get('/api/products/notreal');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', true);
  });
});

describe('GET /api/recommendations/:productId', () => {
  it('should return recommendations for a valid product', async () => {
    const res = await request(app).get('/api/recommendations/p1');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.recommendations)).toBe(true);
  });
});
