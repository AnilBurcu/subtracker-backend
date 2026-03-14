# SubTracker Backend

A production-ready REST API for tracking recurring subscriptions with automated renewal reminders via email.

`RESTful API` | `MVC Architecture` | `JWT Auth` | `Upstash Workflows` | `ArcJet Security`

---

## Features

- User registration and authentication with hashed credentials and JWT tokens
- Full CRUD operations for subscription management
- Automated email reminders at 7, 5, 2, and 1 days before renewal
- Durable scheduled workflows powered by Upstash QStash
- Multi-layer API protection: rate limiting, bot detection, and shield mode
- Per-user subscription isolation with ownership verification

## Tech Stack and Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js + Express | HTTP server and routing |
| Database | MongoDB + Mongoose | Data persistence and schema validation |
| Auth | JSON Web Tokens + bcryptjs | Stateless authentication and password hashing |
| Workflows | Upstash QStash | Durable, serverless scheduled tasks |
| Security | ArcJet | Rate limiting, bot detection, DDoS protection |
| Email | Nodemailer (Gmail SMTP) | Transactional reminder emails |
| Date Handling | Day.js | Lightweight date arithmetic |

**Architecture:** MVC pattern with clear separation between routes, controllers, models, and middleware. Business logic lives in controllers, cross-cutting concerns (auth, rate limiting, error handling) are handled through composable middleware, and scheduled work is offloaded to Upstash workflows rather than in-process cron jobs.

**Why this stack:** MongoDB pairs well with the flexible subscription schema (variable frequencies, categories, currencies). Upstash workflows provide durable execution that survives server restarts -- critical for reminders that may fire days after creation. ArcJet adds production-grade API protection without manual rate limiter setup.

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/sign-up` | Register a new user | No |
| POST | `/api/v1/auth/sign-in` | Authenticate and receive JWT | No |
| POST | `/api/v1/auth/sign-out` | Log out | No |
| GET | `/api/v1/users` | List all users | No |
| GET | `/api/v1/users/:id` | Get user by ID | Yes |
| POST | `/api/v1/subscriptions` | Create subscription + trigger reminder workflow | Yes |
| GET | `/api/v1/subscriptions/user/:id` | Get all subscriptions for a user | Yes |
| PUT | `/api/v1/subscriptions/:id/cancel` | Cancel a subscription | Yes |
| GET | `/api/v1/subscriptions/upcoming-renewals` | Get upcoming renewals | Yes |

## Technical Highlights

**Durable Reminder Workflows** -- When a subscription is created, an Upstash workflow is triggered that sleeps until each reminder date using `context.sleepUntil()`. This produces a persistent execution that survives deployments and server restarts, with each subscription maintaining its own independent workflow lifecycle.

**Layered Security** -- Every request passes through ArcJet middleware configured with three rules: Shield mode (blocks common attack patterns like SQLi and XSS), bot detection (allows legitimate crawlers, blocks malicious bots), and token bucket rate limiting (5 req/10s per client). JWT authentication is layered on top for protected routes.

**Data Integrity via Pre-save Hooks** -- The Subscription model uses Mongoose pre-save hooks to auto-calculate `renewalDate` from `startDate` + `frequency` when not explicitly provided, and to auto-expire subscriptions whose renewal date has passed. This keeps business logic close to the data layer and prevents inconsistent states.

**Centralized Error Handling** -- A single error middleware catches and normalizes Mongoose validation errors, duplicate key violations (11000), and invalid ObjectId casts into consistent API responses with appropriate HTTP status codes.

## Project Structure

```
subtracker-backend/
├── app.js                  # Express app setup, middleware registration, route mounting
├── config/
│   ├── arcjet.js           # Rate limiting and bot detection rules
│   ├── env.js              # Environment variable loader
│   ├── nodemailer.js       # Email transporter configuration
│   └── upstash.js          # Upstash workflow client
├── controllers/
│   ├── auth.controller.js          # Sign-up, sign-in, sign-out logic
│   ├── subscription.controller.js  # Subscription CRUD + workflow trigger
│   ├── user.controller.js          # User retrieval
│   └── workflow.controller.js      # Upstash reminder workflow definition
├── database/
│   └── mongodb.js          # MongoDB connection handler
├── middlewares/
│   ├── arcjet.middleware.js # ArcJet security middleware
│   ├── auth.middleware.js   # JWT verification and user attachment
│   └── error.middleware.js  # Global error handler
├── models/
│   ├── subscription.model.js   # Subscription schema with pre-save hooks
│   └── user.model.js           # User schema with password hashing
├── routes/
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   ├── user.routes.js
│   └── workflow.route.js
└── utils/
    ├── email-template.js   # HTML email templates for reminders
    └── send.email.js       # Email dispatch utility
```

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development
SERVER_URL=http://localhost:3000

# Database
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/subtracker

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# ArcJet Security
ARCJET_ENV=development
ARCJET_KEY=your_arcjet_key

# Upstash Workflow
QSTASH_URL=http://127.0.0.1:8080
QSTASH_TOKEN=your_qstash_token

# Email (Gmail SMTP)
EMAIL_PASSWORD=your_gmail_app_password
```

Environment files follow the pattern `.env.<NODE_ENV>.local` (e.g., `.env.development.local`).

## Getting Started

**Prerequisites:** Node.js 18+, MongoDB instance, Upstash account (for production workflows)

```bash
# Clone the repository
git clone https://github.com/<your-username>/subtracker-backend.git
cd subtracker-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.development.local
# Fill in your environment variables

# Start Upstash QStash local server (for development)
npx @upstash/qstash-cli dev

# Run in development mode
npm run dev

# Run in production
npm start
```
