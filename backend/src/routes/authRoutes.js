const express = require('express');
const AuthMiddleware = require('../middleware/authMiddleware');

class AuthRoutes {
    constructor(authController) {
        this.authController = authController;
        this.router = express.Router();
        this.authMiddleware = new AuthMiddleware();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/signup', this.authController.signup.bind(this.authController));
        this.router.post('/login', this.authController.login.bind(this.authController));
        this.router.post('/logout', this.authController.logout.bind(this.authController));
        this.router.get('/validate', 
            this.authMiddleware.authenticate.bind(this.authMiddleware),
            this.authController.validateToken.bind(this.authController)
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = AuthRoutes;
