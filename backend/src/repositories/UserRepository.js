const User = require('../models/User');
const database = require('../config/database');

class UserRepository {
    async findByEmail(email) {
        try {
            const rows = await database.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows.length ? User.fromDatabase(rows[0]) : null;
        } catch (error) {
            console.error('Error in UserRepository.findByEmail:', error);
            throw error;
        }
    }

    async findByEmailOrUsername(identifier) {
        try {
            const rows = await database.query(
                'SELECT * FROM users WHERE email = ? OR username = ?',
                [identifier, identifier]
            );
            return rows.length ? User.fromDatabase(rows[0]) : null;
        } catch (error) {
            console.error('Error in UserRepository.findByEmailOrUsername:', error);
            throw error;
        }
    }

    async create(user) {
        try {
            const data = user.toDatabase();
            const result = await database.query(
                'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
                [data.username, data.email, data.password, data.full_name, data.role]
            );
            return { ...user, id: result.insertId };
        } catch (error) {
            console.error('Error in UserRepository.create:', error);
            throw error;
        }
    }
}

module.exports = UserRepository;
