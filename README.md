# Employee Evaluation System

A full-stack web application for managing employee performance evaluations.

## Features

- **Admin Dashboard**: Manage employees, evaluators, and evaluation cycles
- **Evaluation Cycles**: Create and manage evaluation periods
- **Email Notifications**: Automatic email invitations to evaluators
- **Secure Evaluation Forms**: Unique tokens for each evaluation
- **User Authentication**: Secure login with JWT tokens
- **SQLite Database**: Persistent data storage

## Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

```bash
git clone https://github.com/jhonkayleeroisa/honkwang-evaluation-system.git
cd honkwang-evaluation-system
npm install
cd client && npm install && cd ..
```

### Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Database Setup

```bash
npm run db:init
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`
Client runs on `http://localhost:3000`

### Demo Credentials

- Email: `admin@evaluation-system.com`
- Password: `admin123`

## Project Structure

```
server/
  db/          - Database setup and initialization
  middleware/  - Authentication middleware
  routes/      - API endpoints
  services/    - Business logic
  index.js     - Express server

client/
  public/      - Static files
  src/
    pages/     - React pages
    services/  - API client
    App.js     - Main app component
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Employees
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee

### Evaluators
- `GET /api/evaluators` - List evaluators
- `POST /api/evaluators` - Create evaluator

### Evaluations
- `GET /api/evaluations/cycles` - List cycles
- `POST /api/evaluations/cycles` - Create cycle
- `POST /api/evaluations/assign` - Assign evaluation
- `GET /api/evaluations/token/:token` - Get evaluation
- `POST /api/evaluations/submit/:token` - Submit evaluation

## Deployment

### GitHub Pages (Frontend)

```bash
cd client
npm run build
```

### Heroku/Render (Backend)

1. Create an app on Heroku/Render
2. Set environment variables
3. Deploy the server folder

## License

MIT