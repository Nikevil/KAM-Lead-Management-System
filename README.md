# KAM Lead Management System

Lead management system for Key Account Managers (KAMs) handling B2B restaurant accounts.

## Features

- Lead & restaurant management
- Multi-POC contact tracking
- Interaction & call history
- Performance analytics
- Call scheduling

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm/yarn

## Environment Setup

1. Clone repository
2. Create new `.env` file:

3. Configure environment variables:
```
# This file contains the environment variables that are used in the application.

# Database Configuration
DATABASE_URL= "postgresql://user:password@localhost:5432/kam_db"

# JWT Configuration
JWT_SECRET= your_jwt_secret

# JWT Expiration Time
JWT_EXPIRES_IN=1d

# Server Configuration
PORT=3000

# performance metrics
THRESHOLD_AMOUNT=10000

UNDERPERFORMING_DAYS=60

FREQUENCY_THRESHOLD=3

THRESHOLD_DAYS=30
```

## Installation

```bash
npm install
```

## Running the Application

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## Testing

Run tests:
```bash
npm run test
```

Coverage report:
```bash
npm run test:coverage
```

View coverage report at `coverage/lcov-report/index.html`

## API Documentation

Complete API documentation available at: https://documenter.getpostman.com/view/40631262/2sAYJ7fycv#intro

Base URL: https://kam-production.up.railway.app/

Note:- Use below Creds For Admin Access:
```
{
    "username": "johndoe123",
    "password": "securepassword!"
}
```

Authentication: Bearer token required for all endpoints except `/auth`

## Database Schema

Key tables:
- leads
- contacts
- interactions 
- calls
- performance_metrics

## Deployment

The application is deployed at: https://kam-production.up.railway.app/

CI/CD pipeline runs on merge to `Production` branch:
1. Install packages
2. Deploy to production

## Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit PR

## License

MIT
