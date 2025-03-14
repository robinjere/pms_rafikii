const express = require('express');

class UtilityRoutes {
  constructor(utilityController) {
    this.utilityController = utilityController;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Get all utilities for a property
    this.router.get('/:propertyId', this.utilityController.getUtilitiesByPropertyId.bind(this.utilityController));
    
    // Create a new utility bill
    this.router.post('/', this.utilityController.createUtility.bind(this.utilityController));
    
    // Get a specific utility bill
    this.router.get('/bill/:id', this.utilityController.getUtilityById.bind(this.utilityController));
    
    // Update a utility bill
    this.router.put('/bill/:id', this.utilityController.updateUtility.bind(this.utilityController));
    
    // Delete a utility bill
    this.router.delete('/bill/:id', this.utilityController.deleteUtility.bind(this.utilityController));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UtilityRoutes;