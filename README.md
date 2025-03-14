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
git clone <repository-url>
cd test_dev
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

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MySQL: localhost:3306

## License

This project is licensed under the MIT License - see the LICENSE file for details.
