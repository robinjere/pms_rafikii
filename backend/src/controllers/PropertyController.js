class PropertyController {
  constructor(propertyService) {
    this.propertyService = propertyService;
  }

  async getAllProperties(req, res, next) {
    try {
      const properties = await this.propertyService.getAllProperties();
      res.json(properties);
    } catch (error) {
      next(error);
    }
  }

  async getPropertyById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const property = await this.propertyService.getPropertyWithUtilities(id);
      res.json(property);
    } catch (error) {
      next(error);
    }
  }

  async createProperty(req, res, next) {
    try {
      const propertyData = req.body;
      const newProperty = await this.propertyService.createProperty(propertyData);
      res.status(201).json(newProperty);
    } catch (error) {
      next(error);
    }
  }

  async updateProperty(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const propertyData = req.body;
      const updatedProperty = await this.propertyService.updateProperty(id, propertyData);
      res.json(updatedProperty);
    } catch (error) {
      next(error);
    }
  }

  async deleteProperty(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.propertyService.deleteProperty(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchProperties(req, res, next) {
    try {
      const { term, type } = req.query;
      const properties = await this.propertyService.searchProperties({ term, type });
      res.json(properties);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PropertyController;