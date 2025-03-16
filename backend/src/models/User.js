class User {
    constructor(id, username, email, password, fullName, role = 'user') {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
    }

    static fromDatabase(row) {
        return new User(
            row.id,
            row.username,
            row.email,
            row.password,
            row.full_name,
            row.role
        );
    }

    toDatabase() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            password: this.password,
            full_name: this.fullName,
            role: this.role
        };
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
            role: this.role
        };
    }
}

module.exports = User;
