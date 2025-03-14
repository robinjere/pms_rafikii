const mysql = require('mysql2/promise');
const database = require('../../config/database');

class TestDatabase {
  static async initialize() {
    const testConfig = {
      host: process.env.TEST_DB_HOST || 'localhost',
      user: process.env.TEST_DB_USER || 'pms_user',
      password: process.env.TEST_DB_PASSWORD || 'root123',
      database: process.env.TEST_DB_NAME || 'property_management_test',
      port: process.env.TEST_DB_PORT || 3306
    };

    // Create test database if it doesn't exist
    const tempConnection = await mysql.createConnection({
      ...testConfig,
      database: undefined
    });

    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${testConfig.database}`);
    await tempConnection.end();

    // Initialize database connection with test config
    database.pool = mysql.createPool(testConfig);

    return database;
  }

  static async cleanup() {
    if (database.pool) {
      await database.pool.end();
    }
  }
}

module.exports = TestDatabase;
