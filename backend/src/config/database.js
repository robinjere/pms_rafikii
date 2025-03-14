const mysql = require('mysql2/promise');

class Database {
  constructor() {
    this.pool = null;
  }

  async initialize() {
    try {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      
      console.log('Database connection initialized');
    } catch (error) {
      console.error('Failed to initialize database connection:', error);
      throw error;
    }
  }

  async query(sql, params) {
    try {
      const [results] = await this.pool.query(sql, params);
      return results;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async getConnection() {
    try {
      return await this.pool.getConnection();
    } catch (error) {
      console.error('Failed to get database connection:', error);
      throw error;
    }
  }
}

// Singleton instance
const database = new Database();

module.exports = database;