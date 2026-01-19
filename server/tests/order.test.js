const request = require('supertest');
const app = require('../src/app');

let token = '';
let orderId = '';

const testUser = {
  name: 'Order Tester',
  email: `ordertest_${Date.now()}@example.com`,
  password: 'securepass123',
};

beforeAll(async () => {
  const res = await request(app).post('/api/auth/register').send(testUser);
  token = res.body.token;
});

describe('Cart', () => {
  it('should start with empty cart', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.total).toEqual(0);
  });

  it('should add item to cart', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'p1', quantity: 2 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.cart.length).toBeGreaterThan(0);
  });

  it('should reject invalid quantity', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'p1', quantity: 0 });
    expect(res.statusCode).toEqual(422);
  });

  it('should remove item from cart', async () => {
    const res = await request(app)
      .delete('/api/cart/p1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe('Orders', () => {
  beforeEach(async () => {
    // ensure p2 is in cart before placing order
    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'p2', quantity: 1 });
  });

  it('should place an order and clear cart', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: 'p2', quantity: 1 }] });
    expect(res.statusCode).toEqual(201);
    expect(res.body.order).toHaveProperty('id');
    expect(res.body.order.status).toEqual('Order Placed');
    orderId = res.body.order.id;
  });

  it('should get order history', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.orders)).toBe(true);
  });

  it('should update order status', async () => {
    if (!orderId) return;
    const res = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Packed' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.order.status).toEqual('Packed');
  });
});
