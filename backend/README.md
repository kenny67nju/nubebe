# Nubebe Backend API

> **Wealth Management & Global Compliance Audit Platform - Backend System**

This is the backend API for the Nubebe (牛倍贝) wealth management platform, providing RESTful endpoints for compliance ledger management, risk assessment, and multi-jurisdictional financial analysis.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Development](#development)
- [Deployment](#deployment)

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.8
- **Framework:** Express.js 4.21
- **ORM:** Prisma 6.1
- **Database:** PostgreSQL 14+
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Password Hashing:** bcryptjs
- **Security:** Helmet, CORS, Rate Limiting

---

## ✨ Features

### Core Capabilities

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (ADMIN, ADVISOR, CLIENT, AUDITOR)
  - Secure password hashing with bcrypt

- **Unified Event Management**
  - Create, read, update, delete (CRUD) operations for financial events
  - Advanced filtering by asset class, jurisdiction, compliance status
  - Multi-dimensional compliance tracking
  - Fund flow path tracing

- **Client Management**
  - Client profile management
  - Multi-nationality and tax residency tracking
  - Risk level assessment
  - Comprehensive client statistics

- **Risk Assessment**
  - Automated risk metrics calculation
  - Large transaction monitoring (>500K CNY)
  - Cross-border transfer detection
  - Suspicious crypto activity alerts
  - Risk scoring algorithm

- **Compliance Features**
  - Multi-jurisdictional compliance status tracking
  - Legal structure validation (INDIVIDUAL, CORPORATE, TRUST)
  - Verification status management
  - Bio-identity event tracking
  - Entity governance event logging

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seed data
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client setup
│   │   └── env.ts             # Environment configuration
│   ├── controllers/
│   │   ├── authController.ts  # Authentication logic
│   │   ├── clientController.ts # Client management
│   │   └── eventController.ts # Event management
│   ├── middleware/
│   │   ├── auth.ts            # Auth middleware
│   │   ├── errorHandler.ts   # Global error handler
│   │   └── validate.ts        # Validation middleware
│   ├── routes/
│   │   ├── authRoutes.ts      # Auth endpoints
│   │   ├── clientRoutes.ts    # Client endpoints
│   │   ├── eventRoutes.ts     # Event endpoints
│   │   └── index.ts           # Route aggregator
│   ├── services/
│   │   ├── authService.ts     # Auth business logic
│   │   ├── clientService.ts   # Client business logic
│   │   └── eventService.ts    # Event business logic
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   ├── jwt.ts             # JWT utilities
│   │   ├── password.ts        # Password utilities
│   │   └── riskCalculator.ts # Risk calculation logic
│   └── index.ts               # Application entry point
├── .env.example               # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** 18.x or higher
- **npm:** 9.x or higher
- **PostgreSQL:** 14.x or higher

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your database and JWT secret.

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database (optional)**
   ```bash
   npm run prisma:seed
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

---

## 🗄️ Database Setup

### PostgreSQL Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE nubebe;

# Create user (optional)
CREATE USER nubebe_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nubebe TO nubebe_user;
```

### Run Migrations

```bash
npm run prisma:migrate
```

This will create all necessary tables based on the Prisma schema.

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### **Authentication**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/profile` | Get current user | Private |

**Register Request:**
```json
{
  "email": "advisor@nubebe.com",
  "password": "password123",
  "name": "John Doe",
  "role": "ADVISOR"
}
```

**Login Request:**
```json
{
  "email": "advisor@nubebe.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "email": "advisor@nubebe.com",
      "name": "John Doe",
      "role": "ADVISOR"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

#### **Clients**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/clients` | Create new client | ADMIN, ADVISOR |
| GET | `/clients` | Get all clients | Private |
| GET | `/clients/:id` | Get client by ID | Private |
| PUT | `/clients/:id` | Update client | ADMIN, ADVISOR |
| DELETE | `/clients/:id` | Delete client | ADMIN |
| GET | `/clients/:id/stats` | Get client statistics | Private |

**Create Client Request:**
```json
{
  "clientCode": "CLIENT_002",
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "nationality": ["US"],
  "taxResidency": ["US"],
  "advisorId": "clx..."
}
```

---

#### **Events**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/events` | Create new event | ADMIN, ADVISOR |
| GET | `/events` | Get all events (with filters) | Private |
| GET | `/events/:id` | Get event by ID | Private |
| PUT | `/events/:id` | Update event | ADMIN, ADVISOR |
| DELETE | `/events/:id` | Delete event | ADMIN |
| GET | `/events/risk-metrics` | Get risk metrics | Private |
| GET | `/events/:id/flow-path` | Get fund flow path | Private |
| GET | `/events/client/:clientId` | Get client events | Private |

**Query Parameters for GET /events:**
- `clientId` - Filter by client
- `eventType` - Filter by event type (e.g., TRANSFER_IN)
- `assetClass` - Filter by asset class (e.g., CRYPTO)
- `complianceStatus` - Filter by status (COMPLIANT, UNDER_REVIEW, NON_COMPLIANT)
- `startDate` - Filter by date range (ISO 8601)
- `endDate` - Filter by date range
- `minAmount` - Minimum functional amount
- `maxAmount` - Maximum functional amount
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)
- `sortBy` - Sort field (default: transactionTime)
- `sortOrder` - Sort order: asc/desc (default: desc)

**Example Request:**
```bash
GET /api/events?clientId=clx...&assetClass=CRYPTO&page=1&limit=20
```

**Create Event Request:**
```json
{
  "eventId": "evt_crypto_001",
  "clientId": "clx...",
  "eventType": "CRYPTO_BUY",
  "assetClass": "CRYPTO",
  "transactionTime": "2024-06-15T10:30:00Z",
  "postingDate": "2024-06-15",
  "assetName": "Bitcoin",
  "institutionName": "Binance",
  "accountId": "BNC_12345",
  "quantity": 0.5,
  "price": 60000,
  "grossAmount": 30000,
  "netAmount": 29950,
  "currency": "USD",
  "functionalAmount": 216000,
  "legalStructure": "INDIVIDUAL",
  "sourceCountry": "US",
  "jurisdictionType": "OFFSHORE",
  "verificationStatus": "VERIFIED",
  "complianceStatus": "COMPLIANT",
  "fundFlowPath": ["evt_crypto_001"]
}
```

---

#### **Risk Metrics**

**GET /events/risk-metrics**

Response:
```json
{
  "success": true,
  "data": {
    "largeTransactionCount": 5,
    "crossBorderCount": 8,
    "suspiciousCryptoCount": 1,
    "brokenFlowCount": 0,
    "totalRiskScore": 215
  }
}
```

**Risk Scoring:**
- Large transaction (>500K CNY): 10 points
- Cross-border transfer: 15 points
- Suspicious crypto: 50 points
- Broken flow: 30 points

---

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/nubebe?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Never commit the `.env` file to version control!

---

## 📜 Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build
npm run build            # Compile TypeScript to JavaScript

# Production
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (GUI)
npm run prisma:seed      # Seed database with test data

# Testing
npm test                 # Run tests (not yet implemented)
```

---

## 👨‍💻 Development

### Adding a New Endpoint

1. **Define the route** in `src/routes/`
2. **Create controller** in `src/controllers/`
3. **Implement business logic** in `src/services/`
4. **Update Prisma schema** if needed
5. **Run migration** if schema changed

### Code Style

- Use **TypeScript** for all new code
- Follow **REST API** conventions
- Use **async/await** for asynchronous operations
- Implement proper **error handling**
- Add **JSDoc comments** for complex functions

### Database Migrations

After modifying `prisma/schema.prisma`:

```bash
npm run prisma:migrate
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Enable SSL for database connection
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up logging (e.g., Winston)
- [ ] Use process manager (PM2, Docker)
- [ ] Set up monitoring (e.g., Sentry)

### Docker Deployment (Example)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t nubebe-backend .
docker run -p 5000:5000 --env-file .env nubebe-backend
```

---

## 🧪 Testing

To run tests (when implemented):

```bash
npm test
```

---

## 📝 API Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

---

## 🔧 Troubleshooting

### Common Issues

**Database Connection Error:**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify DATABASE_URL in `.env`
- Ensure database exists: `psql -U postgres -l`

**Port Already in Use:**
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

**Prisma Client Not Generated:**
```bash
npm run prisma:generate
```

---

## 📄 License

MIT

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@nubebe.com

---

**Built with ❤️ by the Nubebe Team**
