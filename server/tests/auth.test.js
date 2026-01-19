const request = require('supertest');
const app = require('../src/app');

let token = '';
const testUser = {
  name: 'Test User',
  email: `testauth_${Date.now()}@example.com`,
  password: 'password123',
};

describe('POST /api/auth/register', () => {
  it('should register a new user and return token', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
    token = res.body.token;
  });

  it('should reject duplicate email registration', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toEqual(409);
    expect(res.body.error).toBe(true);
  });

  it('should reject invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'notanemail', password: 'abc123' });
    expect(res.statusCode).toEqual(422);
  });

  it('should reject short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'a@b.com', password: '12' });
    expect(res.statusCode).toEqual(422);
  });
});

describe('POST /api/auth/login', () => {
  it('should login and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.statusCode).toEqual(401);
  });

  it('should reject missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email });
    expect(res.statusCode).toEqual(422);
  });
});

describe('Protected routes require auth', () => {
  it('should return 401 on GET /api/cart without token', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 on GET /api/wishlist without token', async () => {
    const res = await request(app).get('/api/wishlist');
    expect(res.statusCode).toEqual(401);
  });
});
