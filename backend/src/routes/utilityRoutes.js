const express = require('express');

class UtilityRoutes {
  constructor(utilityController) {
    this.utilityController = utilityController;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/:propertyId', this.utilityController.getUtilitiesByPropertyId.bind(this.utilityController));
    this.router.post('/', this.utilityController.createUtility.bind(this.utilityController));
    this.router.get('/bill/:id', this.utilityController.getUtilityById.bind(this.utilityController));
    this.router.put('/bill/:id', this.utilityController.updateUtility.bind(this.utilityController));
    this.router.delete('/bill/:id', this.utilityController.deleteUtility.bind(this.utilityController));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UtilityRoutes;