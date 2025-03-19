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
- Node.js >= 18.x
- MySQL >= 8.0 
  
### Manual Setup

1. Clone the repository:
```bash
git clone https://github.com/robinjere/pms_rafikii.git
cd pms_rafikii
```

2. Install dependencies for the backend:
```bash
cd backend
npm install
```

3. Configure the database:
   - Create a MySQL database
   - Copy `.env.example` to `.env` and update database credentials for both the backend and frontend.

4. Initialize the database:
```bash
# RUnning MySQL migration scripts
mysql -u root -p < backend/scripts/migrations/00-init-user.sql
mysql -u root -p < backend/scripts/migrations/01-create-tables.sql
mysql -u root -p < backend/scripts/migrations/02-create-auth-tables.sql

# DB User Credential
DB_USER = pms_user
DB_PASSWORD = root123

# Seed initial data
mysql -u root -p property_management < backend/scripts/seeds/01-seed-data.sql
```

5. Start the backend server:
```bash
npm start
```

6. Install dependencies for the frontend:
```bash
cd ../frontend
npm install
```

7. Start the frontend server:
```bash
npm start
```

### Authentication
After starting the application:

1. Open http://localhost:3000 in your browser
2. Use the default admin credentials:
   - Email: admin@rafikii.com or Username: admin
   - Password: admin123

Or create a new account:

1. Click "Sign up" to create a new account
2. Fill in the registration form:
   - Full Name
   - Username
   - Email Address (must be valid format)
   - Password (minimum 8 characters, must include uppercase, lowercase, and numbers)
3. Click "Sign up" to complete registration
4. You will be redirected to Properties Page

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Create a new user account
```json
{
  "username": "johndoe",
  "email": "user@example.com",
  "password": "Password123",
  "fullName": "John Doe"
}
```

#### POST /api/auth/login
Authenticate user (using email or username)
```json
{
  "identifier": "johndoe",
  "password": "Password123"
}
```

### Property Endpoints

#### GET /api/properties
Get all properties with optional search params:
- term: search term
- type: residential|commercial
- page: page number
- limit: items per page
- sortBy: name|type|address
- sortOrder: asc|desc

#### GET /api/properties/:id
Get property details with utilities

#### POST /api/properties
Create new property
```json
{
  "name": "Property Name",
  "address": "123 Street",
  "type": "residential"
}
```

#### PUT /api/properties/:id
Update property
```json
{
  "name": "Updated Name",
  "address": "456 Avenue",
  "type": "commercial"
}
```

#### DELETE /api/properties/:id
Delete property and associated utilities

### Utility Endpoints

#### GET /api/utilities/:propertyId
Get utilities for a property with optional params:
- page: page number
- limit: items per page
- sortBy: type|amount|date
- sortOrder: asc|desc

#### POST /api/utilities
Create new utility bill
```json
{
  "propertyId": "123",
  "type": "electricity",
  "amount": 150.50,
  "date": "2024-03-01"
}
```

#### GET /api/utilities/bill/:id
Get utility bill details

#### PUT /api/utilities/bill/:id
Update utility bill
```json
{
  "propertyId": "123",
  "type": "water",
  "amount": 75.25,
  "date": "2024-03-01"
}
```

#### DELETE /api/utilities/bill/:id
Delete utility bill

## Database Schema

The database schema consists of the following tables:

### Users
- **id**: Primary key, auto-increment
- **username**: Unique username
- **email**: Unique email address
- **password**: Hashed password
- **fullName**: Full name of the user
- **role**: Role of the user (e.g., admin, manager, user)
- **createdAt**: Timestamp of account creation
- **updatedAt**: Timestamp of last update

### Properties
- **id**: Primary key, auto-increment
- **name**: Name of the property
- **address**: Address of the property
- **type**: Type of property (residential or commercial)
- **status**: Status of the property (e.g., available, occupied)
- **createdAt**: Timestamp of property creation
- **updatedAt**: Timestamp of last update

### Utilities
- **id**: Primary key, auto-increment
- **propertyId**: Foreign key referencing Properties table
- **type**: Type of utility (e.g., electricity, water, gas)
- **amount**: Amount of utility consumption
- **date**: Date of utility bill
- **createdAt**: Timestamp of utility bill creation
- **updatedAt**: Timestamp of last update