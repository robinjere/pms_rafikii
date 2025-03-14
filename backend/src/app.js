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
const ErrorHandler = require('./middleware/errorHandler');

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
    
    // Serve static files from the React app in production
    if (process.env.NODE_ENV === 'production') {
      this.app.use(express.static(path.join(__dirname, '../client/build')));
    }
  }

  setupDependencies() {
    // Repositories
    this.propertyRepository = new PropertyRepository();
    this.utilityRepository = new UtilityRepository();
    this.userRepository = new UserRepository();
    
    // Services (with dependency injection)
    this.utilityService = new UtilityService(this.utilityRepository, this.propertyRepository);
    this.propertyService = new PropertyService(this.propertyRepository, this.utilityService);
    this.authService = new AuthService(this.userRepository);
    
    // Controllers (with dependency injection)
    this.propertyController = new PropertyController(this.propertyService);
    this.utilityController = new UtilityController(this.utilityService);
    this.authController = new AuthController(this.authService);
    
    // Routes (with dependency injection)
    this.propertyRoutes = new PropertyRoutes(this.propertyController);
    this.utilityRoutes = new UtilityRoutes(this.utilityController);
    this.authRoutes = new AuthRoutes(this.authController);
    
    // Error handler
    this.errorHandler = new ErrorHandler();
  }

  setupRoutes() {
    // Add auth routes before other routes
    this.app.use('/api/auth', this.authRoutes.getRouter());
    
    // API routes
    this.app.use('/api/properties', this.propertyRoutes.getRouter());
    this.app.use('/api/utilities', this.utilityRoutes.getRouter());
    
    // In production, serve the React app for any other request
    if (process.env.NODE_ENV === 'production') {
      this.app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
      });
    }
  }

  setupErrorHandling() {
    // Error handling middleware must be the last middleware
    this.app.use(this.errorHandler.handleError);
  }
}

module.exports = App;