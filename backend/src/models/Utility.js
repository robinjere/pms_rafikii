class Utility {
  constructor(id, propertyId, type, amount, date) {
    this.id = id;
    this.propertyId = propertyId;
    this.type = type;
    this.amount = amount;
    this.date = date;
  }

  static fromDatabase(row) {
    return new Utility(
      row.id,
      row.property_id,
      row.type,
      parseFloat(row.amount),
      new Date(row.date)
    );
  }

  toDatabase() {
    return {
      id: this.id,
      property_id: this.propertyId,
      type: this.type,
      amount: this.amount,
      date: this.date
    };
  }

  toJSON() {
    return {
      id: this.id,
      propertyId: this.propertyId,
      type: this.type,
      amount: this.amount,
      date: this.date
    };
  }
}

module.exports = Utility;