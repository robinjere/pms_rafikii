const request = require('supertest');
const App = require('../app');
const TestDatabase = require('./helpers/testDb');

describe('Utility API Endpoints', () => {
  let app;
  let testToken;
  let testPropertyId;

  beforeAll(async () => {
    await TestDatabase.initialize();
    app = await new App().initialize();
    
    // Get auth token and create test property
    const authResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    
    testToken = authResponse.body.token;

    const propertyResponse = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        name: 'Test Property',
        address: '123 Test St',
        type: 'residential'
      });

    testPropertyId = propertyResponse.body.id;
  });

  afterAll(async () => {
    await TestDatabase.cleanup();
  });

  const testUtility = {
    type: 'electricity',
    amount: 100.50,
    date: '2024-03-01'
  };

  describe('POST /api/utilities', () => {
    it('should create a new utility bill', async () => {
      const response = await request(app)
        .post('/api/utilities')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          ...testUtility,
          propertyId: testPropertyId
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe(testUtility.type);
    });
  });

  describe('GET /api/utilities/:propertyId', () => {
    it('should return utilities for a property', async () => {
      const response = await request(app)
        .get(`/api/utilities/${testPropertyId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
});
