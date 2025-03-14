const express = require('express');

class PropertyRoutes {
  constructor(propertyController) {
    this.propertyController = propertyController;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Add search endpoint before other routes to avoid conflicts
    this.router.get('/search', this.propertyController.searchProperties.bind(this.propertyController));
    
    // Get all properties
    this.router.get('/', this.propertyController.getAllProperties.bind(this.propertyController));
    
    // Get a specific property with its utility bills
    this.router.get('/:id', this.propertyController.getPropertyById.bind(this.propertyController));
    
    // Create a new property
    this.router.post('/', this.propertyController.createProperty.bind(this.propertyController));
    
    // Update a property
    this.router.put('/:id', this.propertyController.updateProperty.bind(this.propertyController));
    
    // Delete a property
    this.router.delete('/:id', this.propertyController.deleteProperty.bind(this.propertyController));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = PropertyRoutes;