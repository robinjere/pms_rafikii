class Property {
    constructor(id, name, address, type) {
      this.id = id;
      this.name = name;
      this.address = address;
      this.type = type;
    }
  
    static fromDatabase(row) {
      return new Property(
        row.id,
        row.name,
        row.address,
        row.type
      );
    }
  
    toDatabase() {
      return {
        id: this.id,
        name: this.name,
        address: this.address,
        type: this.type
      };
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        address: this.address,
        type: this.type
      };
    }
  }
  
  module.exports = Property;