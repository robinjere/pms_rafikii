const Utility = require('../models/Utility');
const UtilityRepository = require('../repositories/UtilityRepository');

class UtilityService {
  constructor(utilityRepository, propertyRepository) {
    this.utilityRepository = utilityRepository;
    this.propertyRepository = propertyRepository;
  }

  async getUtilitiesByPropertyId(propertyId) {
    return await this.utilityRepository.findByPropertyId(propertyId);
  }

  async getUtilityById(id) {
    const utility = await this.utilityRepository.findById(id);
    if (!utility) {
      const error = new Error('Utility bill not found');
      error.statusCode = 404;
      throw error;
    }
    return utility;
  }

  async createUtility(utilityData) {
    this.validateUtilityData(utilityData);
    
    const property = await this.propertyRepository.findById(utilityData.propertyId);
    if (!property) {
      const error = new Error('Property not found');
      error.statusCode = 404;
      throw error;
    }
    
    const utility = new Utility(
      null,
      utilityData.propertyId,
      utilityData.type,
      utilityData.amount,
      new Date(utilityData.date)
    );
    
    return await this.utilityRepository.create(utility);
  }

  async updateUtility(id, utilityData) {
    this.validateUtilityData(utilityData);
    
    await this.getUtilityById(id);
    
    const property = await this.propertyRepository.findById(utilityData.propertyId);
    if (!property) {
      const error = new Error('Property not found');
      error.statusCode = 404;
      throw error;
    }
    
    const utility = new Utility(
      id,
      utilityData.propertyId,
      utilityData.type,
      utilityData.amount,
      new Date(utilityData.date)
    );
    
    return await this.utilityRepository.update(utility);
  }

  async deleteUtility(id) {
    await this.getUtilityById(id);
    await this.utilityRepository.delete(id);
    return { message: 'Utility bill deleted successfully' };
  }

  validateUtilityData(data) {
    const errors = [];
    
    if (!data.type || !['electricity', 'water', 'gas'].includes(data.type)) {
      errors.push('Utility type must be electricity, water, or gas');
    }
    
    if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
      errors.push('Utility amount must be a positive number');
    }
    
    if (!data.date || !this.isValidDate(data.date)) {
      errors.push('Valid date is required');
    }
    
    if (!data.propertyId) {
      errors.push('Property ID is required');
    }
    
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }
  }

  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
}

module.exports = UtilityService;