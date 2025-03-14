const request = require('supertest');
const App = require('../app');
const TestDatabase = require('./helpers/testDb');

describe('Property API Endpoints', () => {
  let app;
  let testToken;

  beforeAll(async () => {
    await TestDatabase.initialize();
    app = await new App().initialize();
    
    // Get auth token for protected routes
    const authResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    
    testToken = authResponse.body.token;
  });

  afterAll(async () => {
    await TestDatabase.cleanup();
  });

  const testProperty = {
    name: 'Test Property',
    address: '123 Test St',
    type: 'residential'
  };

  describe('POST /api/properties', () => {
    it('should create a new property', async () => {
      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${testToken}`)
        .send(testProperty);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testProperty.name);
    });
  });

  describe('GET /api/properties', () => {
    it('should return all properties', async () => {
      const response = await request(app)
        .get('/api/properties')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
});
