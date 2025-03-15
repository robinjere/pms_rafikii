# Property Management System

This system provides a comprehensive solution for managing properties and their utilities. It helps property managers streamline their operations, track utility consumption, and manage property portfolios efficiently.

## Features

- **Property Management**
  - Add, edit, and delete properties
  - Track property details and status
  - Search and filter properties
  - Property type categorization

- **Utility Management**
  - Monitor electricity, water, and gas consumption
  - Track utility bills and payments
  - Generate utility reports
  - Historical data visualization

- **User Management**
  - Secure authentication system
  - Role-based access control
  - User profile management

## Tech Stack

### Frontend
- React 19.0.0
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MySQL 8.0

## Setup Instructions

### Prerequisites
- Docker >= 20.10.0
- Docker Compose >= 2.0.0

### Docker Setup

1. Clone the repository:
```bash
git clone https://github.com/robinjere/pms_rafikii.git
cd pms_rafikii
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your configurations
```

3. Build and start containers:
```bash
docker-compose up --build
```

### Registration
After starting the application:

1. Open http://localhost:3000 in your browser
2. Click "Sign up" to create a new account
3. Fill in the registration form:
   - Full Name
   - Email Address
   - Password
4. Click "Create Account" to complete registration
5. You will be automatically logged in and redirected to the properties dashboard

Note: The first user to register will be assigned admin privileges.

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MySQL: localhost:3306

