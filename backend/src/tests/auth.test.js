const request = require('supertest');
const App = require('../app');
const TestDatabase = require('./helpers/testDb');

describe('Auth API Endpoints', () => {
  let app;

  beforeAll(async () => {
    await TestDatabase.initialize();
    app = await new App().initialize();
  });

  afterAll(async () => {
    await TestDatabase.cleanup();
  });

  describe('POST /api/auth/signup', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'test123',
      fullName: 'Test User'
    };

    it('should create a new user account', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('should reject duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });
});
