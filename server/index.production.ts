import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import { createServer } from 'http';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { setupRoutes } from './routes.mongo.js';
import { setupWebSocket } from './websocket.js';

const app = express();
const server = createServer(app);

// Enable compression
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration
const sessionSecret = process.env.SESSION_SECRET || 'nedaxer-production-secret-key-2025';
const mongoUrl = process.env.MONGODB_URI || 'mongodb+srv://default:default@default.cluster.mongodb.net/nedaxer';

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUrl
  }),
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Setup WebSocket for real-time features
setupWebSocket(server);

// Setup API routes
setupRoutes(app);

// Serve static files from dist/public directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticPath = path.join(__dirname, 'public');

app.use(express.static(staticPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    mongodb: 'connected',
    api: 'active'
  });
});

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Use PORT environment variable or default to 5000 for Replit compatibility
const port = parseInt(process.env.PORT || '5000', 10);

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Nedaxer production server running on port ${port}`);
  console.log(`🌐 Server accessible at http://0.0.0.0:${port}`);
  console.log(`📊 MongoDB connected`);
  console.log(`🚀 All API endpoints active`);
});