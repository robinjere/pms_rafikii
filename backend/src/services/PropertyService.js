const Property = require('../models/Property');
const UtilityService = require('./UtilityService');

class PropertyService {
  constructor(propertyRepository, utilityService) {
    this.propertyRepository = propertyRepository;
    this.utilityService = utilityService;
  }

  async getAllProperties() {
    return await this.propertyRepository.findAll();
  }

  async getPropertyById(id) {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      const error = new Error('Property not found');
      error.statusCode = 404;
      throw error;
    }
    return property;
  }

  async getPropertyWithUtilities(id) {
    const property = await this.getPropertyById(id);
    const utilitiesResponse = await this.utilityService.getUtilitiesByPropertyId(id);
    
    return {
      ...property.toJSON(),
      utilities: utilitiesResponse.items.map(utility => utility.toJSON()),
      utilityPagination: {
        total: utilitiesResponse.total,
        page: utilitiesResponse.page,
        limit: utilitiesResponse.limit,
        totalPages: utilitiesResponse.totalPages
      }
    };
  }

  async createProperty(propertyData) {
    this.validatePropertyData(propertyData);
    
    const property = new Property(
      null,
      propertyData.name,
      propertyData.address,
      propertyData.type
    );
    
    return await this.propertyRepository.create(property);
  }

  async updateProperty(id, propertyData) {
    this.validatePropertyData(propertyData);
    
    // Check if property exists
    await this.getPropertyById(id);
    
    const property = new Property(
      id,
      propertyData.name,
      propertyData.address,
      propertyData.type
    );
    
    return await this.propertyRepository.update(property);
  }

  async deleteProperty(id) {
    // Check if property exists
    await this.getPropertyById(id);
    
    // Delete associated utilities first
    await this.utilityService.deleteUtilitiesByPropertyId(id);
    
    // Then delete the property
    await this.propertyRepository.delete(id);
    
    return { message: 'Property deleted successfully' };
  }

  async searchProperties(searchParams) {
    try {
      return await this.propertyRepository.search(searchParams);
    } catch (error) {
      console.error('Error in searchProperties:', error);
      throw error;
    }
  }

  validatePropertyData(data) {
    const errors = [];
    
    if (!data.name || data.name.trim() === '') {
      errors.push('Property name is required');
    }
    
    if (!data.address || data.address.trim() === '') {
      errors.push('Property address is required');
    }
    
    if (!data.type || !['residential', 'commercial'].includes(data.type)) {
      errors.push('Property type must be either residential or commercial');
    }
    
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }
  }
}

module.exports = PropertyService;