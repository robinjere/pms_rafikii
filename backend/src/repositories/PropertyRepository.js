const Property = require('../models/Property');
const database = require('../config/database');

class PropertyRepository {
  async findAll() {
    try {
      const rows = await database.query('SELECT * FROM properties ORDER BY name');
      return rows.map(row => Property.fromDatabase(row));
    } catch (error) {
      console.error('Error in PropertyRepository.findAll:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const rows = await database.query('SELECT * FROM properties WHERE id = ?', [id]);
      return rows.length ? Property.fromDatabase(rows[0]) : null;
    } catch (error) {
      console.error('Error in PropertyRepository.findById:', error);
      throw error;
    }
  }

  async create(property) {
    try {
      const data = property.toDatabase();
      const result = await database.query(
        'INSERT INTO properties (name, address, type) VALUES (?, ?, ?)',
        [data.name, data.address, data.type]
      );
      return { ...property, id: result.insertId };
    } catch (error) {
      console.error('Error in PropertyRepository.create:', error);
      throw error;
    }
  }

  async update(property) {
    try {
      const data = property.toDatabase();
      await database.query(
        'UPDATE properties SET name = ?, address = ?, type = ? WHERE id = ?',
        [data.name, data.address, data.type, data.id]
      );
      return property;
    } catch (error) {
      console.error('Error in PropertyRepository.update:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await database.query('DELETE FROM properties WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error in PropertyRepository.delete:', error);
      throw error;
    }
  }

  async search(query = {}) {
    try {
      let sql = 'SELECT * FROM properties WHERE 1=1';
      let params = [];
      let countSql = 'SELECT COUNT(*) as total FROM properties WHERE 1=1';

      // Add search term condition if provided
      if (query.term && query.term.trim() !== '') {
        const searchCondition = ' AND (name LIKE ? OR address LIKE ?)';
        sql += searchCondition;
        countSql += searchCondition;
        const searchTerm = `%${query.term}%`;
        params.push(searchTerm, searchTerm);
      }

      // Add type condition if provided
      if (query.type && query.type !== 'all') {
        const typeCondition = ' AND type = ?';
        sql += typeCondition;
        countSql += typeCondition;
        params.push(query.type);
      }

      // Add sorting (ensuring default sort even without query params)
      const validSortFields = ['name', 'type', 'address'];
      const sortField = query.sortBy && validSortFields.includes(query.sortBy) ? query.sortBy : 'name';
      const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${sortField} ${sortOrder}`;

      // Add pagination (ensuring defaults)
      const page = Math.max(1, parseInt(query.page) || 1);
      const limit = Math.max(1, parseInt(query.limit) || 10);
      const offset = (page - 1) * limit;
      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      // Execute both queries
      const [rows, [countResult]] = await Promise.all([
        database.query(sql, params),
        database.query(countSql, params.slice(0, -2)) // Remove limit and offset params
      ]);

      return {
        items: rows.map(row => Property.fromDatabase(row)),
        total: countResult.total,
        page,
        limit,
        totalPages: Math.ceil(countResult.total / limit)
      };
    } catch (error) {
      console.error('Error in PropertyRepository.search:', error);
      throw error;
    }
  }
}

module.exports = PropertyRepository;