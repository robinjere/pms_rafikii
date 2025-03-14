class UtilityController {
  constructor(utilityService) {
    this.utilityService = utilityService;
  }

  async getUtilitiesByPropertyId(req, res, next) {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const utilities = await this.utilityService.getUtilitiesByPropertyId(propertyId);
      res.json(utilities);
    } catch (error) {
      next(error);
    }
  }

  async getUtilityById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const utility = await this.utilityService.getUtilityById(id);
      res.json(utility);
    } catch (error) {
      next(error);
    }
  }

  async createUtility(req, res, next) {
    try {
      const utilityData = req.body;
      const newUtility = await this.utilityService.createUtility(utilityData);
      res.status(201).json(newUtility);
    } catch (error) {
      next(error);
    }
  }

  async updateUtility(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const utilityData = req.body;
      const updatedUtility = await this.utilityService.updateUtility(id, utilityData);
      res.json(updatedUtility);
    } catch (error) {
      next(error);
    }
  }

  async deleteUtility(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.utilityService.deleteUtility(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UtilityController;