const express = require('express');
const cors = require('cors');
const path = require('path');

// Database
const database = require('./config/database');

// Repositories
const PropertyRepository = require('./repositories/PropertyRepository');
const UtilityRepository = require('./repositories/UtilityRepository');
const UserRepository = require('./repositories/UserRepository');

// Services
const PropertyService = require('./services/PropertyService');
const UtilityService = require('./services/UtilityService');
const AuthService = require('./services/AuthService');

// Controllers
const PropertyController = require('./controllers/PropertyController');
const UtilityController = require('./controllers/UtilityController');
const AuthController = require('./controllers/AuthController');

// Routes
const PropertyRoutes = require('./routes/propertyRoutes');
const UtilityRoutes = require('./routes/utilityRoutes');
const AuthRoutes = require('./routes/authRoutes');

// Middleware
const errorHandler = require('./middleware/errorHandler');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupDependencies();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  async initialize() {
    await database.initialize();
    return this.app;
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupDependencies() {
    this.propertyRepository = new PropertyRepository();
    this.utilityRepository = new UtilityRepository();
    this.userRepository = new UserRepository();

    this.utilityService = new UtilityService(this.utilityRepository, this.propertyRepository);
    this.propertyService = new PropertyService(this.propertyRepository, this.utilityService);
    this.authService = new AuthService(this.userRepository);
    
    this.propertyController = new PropertyController(this.propertyService);
    this.utilityController = new UtilityController(this.utilityService);
    this.authController = new AuthController(this.authService);
    
    this.propertyRoutes = new PropertyRoutes(this.propertyController);
    this.utilityRoutes = new UtilityRoutes(this.utilityController);
    this.authRoutes = new AuthRoutes(this.authController);
  }

  setupRoutes() {
    this.app.use('/api/auth', this.authRoutes.getRouter());
    this.app.use('/api/properties', this.propertyRoutes.getRouter());
    this.app.use('/api/utilities', this.utilityRoutes.getRouter());
    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'ok' });
    });
  }

  setupErrorHandling() {
    this.app.use(errorHandler);
  }
}

module.exports = App;