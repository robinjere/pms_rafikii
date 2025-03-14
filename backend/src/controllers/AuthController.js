class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async signup(req, res, next) {
        try {
            const userData = req.body;
            const result = await this.authService.signup(userData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            next(error);
        }
    }

    async validateToken(req, res, next) {
        try {
            res.json({
                valid: true,
                user: req.user
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
