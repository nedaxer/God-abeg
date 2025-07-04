# Nedaxer Trading Platform

A cutting-edge mobile-first cryptocurrency trading platform built with modern web technologies. The application runs on a unified single-port architecture with Express serving both frontend and backend on port 5000.

## 🏗️ Project Structure

```
nedaxer/
├── client/                 # React Frontend (Vite)
│   ├── src/               # React components and pages
│   ├── public/            # Static assets
│   ├── package.json       # Client dependencies
│   ├── vite.config.ts     # Vite configuration
│   ├── tailwind.config.ts # Tailwind CSS configuration
│   └── tsconfig.json      # TypeScript configuration
├── server/                # Node.js Backend (Express + MongoDB)
│   ├── routes.mongo.ts    # API route handlers with MongoDB
│   ├── index.ts           # Main server entry point
│   ├── vite.ts           # Vite middleware integration
│   ├── package.json       # Server dependencies
│   └── tsconfig.json      # TypeScript configuration
├── shared/                # Shared TypeScript definitions
├── render.yaml            # Render single-service deployment
├── package.json           # Root build scripts and dependencies
├── vite.config.ts         # Main Vite configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** 9+
- **MongoDB Atlas** account (or local MongoDB)

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd nedaxer-monorepo
   ```

2. **Install dependencies:**
   ```bash
   # Install all dependencies (root, client, and server)
   npm install
   ```

3. **Set up environment variables:**
   
   **Server environment variables** (create `server/.env`):
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb+srv://your-connection-string
   SESSION_SECRET=your-secret-key
   COINGECKO_API_KEY=your-api-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   SENDGRID_API_KEY=your-sendgrid-key
   ZOHO_EMAIL=your-zoho-email
   ZOHO_PASSWORD=your-zoho-password
   GITHUB_TOKEN=your-github-token
   RECAPTCHA_SECRET_KEY=your-recaptcha-secret
   BASE_URL=http://localhost:3000
   ```

   **Client environment variables** (create `client/.env`):
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
   ```

4. **Start development servers:**
   
   **Option 1: Start both servers concurrently**
   ```bash
   npm run dev
   ```
   
   **Option 2: Start servers separately**
   ```bash
   # Terminal 1 - Start backend server
   npm run dev:server
   
   # Terminal 2 - Start frontend dev server
   npm run dev:client
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📦 Available Scripts

### Root Level Scripts
```bash
npm run dev              # Start backend server (main development command)
npm run dev:client       # Start frontend development server
npm run dev:server       # Start backend development server
npm run build            # Build both client and server
npm run build:client     # Build only frontend
npm run build:server     # Build only backend
npm run start            # Start production server
npm run install:all      # Install dependencies for all packages
npm run clean            # Clean all build files and node_modules
npm run lint             # Lint both client and server
```

### Client Scripts (run from `client/` directory)
```bash
npm run dev              # Start Vite development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # TypeScript type checking
```

### Server Scripts (run from `server/` directory)
```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # TypeScript type checking
```

## 🚢 Deployment on Render

This project is configured for easy deployment on Render using the included `render.yaml` file.

### Prerequisites
1. Create a [Render account](https://render.com)
2. Connect your GitHub repository to Render
3. Set up environment variables in Render dashboard

### Deployment Steps

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial monorepo setup"
   git push origin main
   ```

2. **Create a new Blueprint on Render:**
   - Go to your Render dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Configure environment variables:**
   
   **For nedaxer-server service:**
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `COINGECKO_API_KEY` - CoinGecko API key for crypto prices
   - `GOOGLE_CLIENT_ID` - Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
   - `SENDGRID_API_KEY` - SendGrid API key for emails
   - `ZOHO_EMAIL` - Zoho email for SMTP
   - `ZOHO_PASSWORD` - Zoho email password
   - `GITHUB_TOKEN` - GitHub token for AI features
   - `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret key

   **For nedaxer-client service:**
   - `VITE_RECAPTCHA_SITE_KEY` - reCAPTCHA site key

4. **Deploy:**
   - Click "Apply" to deploy both services
   - Render will build and deploy automatically
   - Your app will be available at the provided URLs

### Service Architecture on Render

The deployment creates two services:

1. **nedaxer-server** (Node.js Web Service)
   - Handles API requests, authentication, database operations
   - Runs on backend URL: `https://nedaxer-server.onrender.com`

2. **nedaxer-client** (Static Site)
   - Serves the React frontend application
   - Runs on frontend URL: `https://nedaxer-client.onrender.com`

## 🛠️ Development Workflow

### Adding New Features

1. **Frontend changes:**
   ```bash
   cd client
   npm run dev
   # Make your changes in src/
   npm run build  # Test production build
   ```

2. **Backend changes:**
   ```bash
   cd server
   npm run dev
   # Make your changes in api/, models/, services/
   npm run build  # Test production build
   ```

3. **Test both together:**
   ```bash
   npm run build  # Build both client and server
   npm run start  # Test production setup locally
   ```

### Database Management

The application uses MongoDB Atlas with Mongoose ORM. Database models are located in `server/models/`.

**Key collections:**
- Users (authentication, profiles)
- Transactions (deposits, withdrawals, transfers)
- Balances (user account balances)
- Notifications (real-time user notifications)

### API Documentation

The backend API provides REST endpoints for:
- Authentication (`/api/auth/*`)
- User management (`/api/user/*`)
- Trading operations (`/api/trading/*`)
- Market data (`/api/crypto/*`)
- Admin operations (`/api/admin/*`)

## 🔧 Configuration Details

### Client Configuration

- **Vite**: Modern build tool with hot reload
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **React Query**: Server state management
- **Wouter**: Lightweight routing

### Server Configuration

- **Express.js**: Web application framework
- **MongoDB/Mongoose**: Database and ODM
- **TypeScript**: Type-safe backend development
- **WebSocket**: Real-time features
- **Session-based Auth**: Secure authentication

## 📁 Important Files

- `render.yaml` - Render deployment configuration
- `client/vite.config.ts` - Frontend build configuration
- `server/index.ts` - Backend application entry point
- `client/src/App.tsx` - Frontend application root
- `server/models/` - Database schema definitions

## 🐛 Troubleshooting

### Common Issues

**Build failures:**
- Ensure Node.js version is 18+
- Check all environment variables are set
- Verify MongoDB connection string is valid

**Asset loading issues:**
- Check Vite configuration in `client/vite.config.ts`
- Ensure asset paths are correct in imports

**TypeScript errors:**
- Run type checking: `npm run lint`
- Check tsconfig.json files in both client and server

**Database connection issues:**
- Verify MongoDB Atlas whitelist includes Render IPs
- Check connection string format and credentials

### Getting Help

1. Check console logs in browser developer tools
2. Check server logs in Render dashboard
3. Verify environment variables are set correctly
4. Test API endpoints directly using curl or Postman

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ for modern web development