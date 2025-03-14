const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

console
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async signup(userData) {
        // Validate email format
        if (!this.isValidEmail(userData.email)) {
            const error = new Error('Invalid email format');
            error.statusCode = 400;
            throw error;
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            const error = new Error('Email already registered');
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create new user
        const user = new User(
            null,
            userData.email,
            hashedPassword,
            userData.fullName,
            userData.role || 'user'
        );

        const newUser = await this.userRepository.create(user);
        return this.generateAuthResponse(newUser);
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        return this.generateAuthResponse(user);
    }

    generateAuthResponse(user) {
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role,
                fullName: user.fullName
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        };
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

module.exports = AuthService;
