const Utility = require('../models/Utility');
const database = require('../config/database');

class UtilityRepository {
  async findByPropertyId(propertyId, query = {}) {
    try {
      let sql = 'SELECT * FROM utilities WHERE property_id = ?';
      let params = [propertyId];
      let countSql = 'SELECT COUNT(*) as total FROM utilities WHERE property_id = ?';

      // Add sorting
      const validSortFields = ['type', 'amount', 'date'];
      const sortField = validSortFields.includes(query.sortBy) ? query.sortBy : 'date';
      const sortOrder = query.sortOrder === 'desc' ? query.sortOrder : 'ASC';
      sql += ` ORDER BY ${sortField} ${sortOrder}`;

      // Add pagination
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;
      const offset = (page - 1) * limit;
      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows, [countResult]] = await Promise.all([
        database.query(sql, params),
        database.query(countSql, [propertyId])
      ]);

      return {
        items: rows.map(row => Utility.fromDatabase(row)),
        total: countResult.total,
        page,
        limit,
        totalPages: Math.ceil(countResult.total / limit)
      };
    } catch (error) {
      console.error('Error in UtilityRepository.findByPropertyId:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const rows = await database.query('SELECT * FROM utilities WHERE id = ?', [id]);
      return rows.length ? Utility.fromDatabase(rows[0]) : null;
    } catch (error) {
      console.error('Error in UtilityRepository.findById:', error);
      throw error;
    }
  }

  async create(utility) {
    try {
      const data = utility.toDatabase();
      const result = await database.query(
        'INSERT INTO utilities (property_id, type, amount, date) VALUES (?, ?, ?, ?)',
        [data.property_id, data.type, data.amount, data.date]
      );
      return { ...utility, id: result.insertId };
    } catch (error) {
      console.error('Error in UtilityRepository.create:', error);
      throw error;
    }
  }

  async update(utility) {
    try {
      const data = utility.toDatabase();
      await database.query(
        'UPDATE utilities SET property_id = ?, type = ?, amount = ?, date = ? WHERE id = ?',
        [data.property_id, data.type, data.amount, data.date, data.id]
      );
      return utility;
    } catch (error) {
      console.error('Error in UtilityRepository.update:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await database.query('DELETE FROM utilities WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error in UtilityRepository.delete:', error);
      throw error;
    }
  }
}

module.exports = UtilityRepository;