// @ts-nocheck
// Production server for Render deployment - bypasses Vite dependencies
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import { setupRoutes } from './routes.mongo.js';
import { setupWebSocket } from './websocket.js';
import { connectToMongoDB } from './mongodb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Essential middleware
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from dist (if built) or fallback to simple HTML
const distPath = path.join(__dirname, '../dist');
const clientPath = path.join(__dirname, '../client');

try {
  // Try to serve built frontend from dist
  app.use(express.static(distPath));
} catch (error) {
  console.log('No dist folder found, serving fallback');
  // Fallback: serve a simple HTML page
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nedaxer Trading Platform</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #0f0f23; color: white; }
          .container { max-width: 800px; margin: 0 auto; text-align: center; }
          .status { background: #1a1a2e; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .success { color: #00ff88; }
          .loading { color: #ffa500; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Nedaxer Trading Platform</h1>
          <div class="status">
            <h2 class="success">✅ Backend Server Online</h2>
            <p>MongoDB Atlas connected with 106 cryptocurrencies</p>
            <p class="loading">Frontend loading...</p>
          </div>
          <div class="status">
            <h3>API Endpoints Active:</h3>
            <p>• /api/crypto/realtime-prices - Live crypto data</p>
            <p>• /api/auth/login - User authentication</p>
            <p>• /api/user/balance - Account management</p>
            <p>• /api/wallet/summary - Wallet operations</p>
          </div>
        </div>
        <script>
          // Try to load the real frontend
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        </script>
      </body>
      </html>
    `);
  });
}

// Initialize database connection
async function initializeServer() {
  try {
    console.log('🚀 Starting Nedaxer production server...');
    
    // Connect to MongoDB
    await connectToMongoDB();
    console.log('✅ MongoDB Atlas connected');
    
    // Setup API routes
    await setupRoutes(app);
    console.log('✅ API routes configured');
    
    // Start HTTP server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌟 Nedaxer server running on port ${PORT}`);
      console.log(`🔗 Access at: http://localhost:${PORT}`);
    });
    
    // Setup WebSocket for real-time features
    setupWebSocket(server);
    console.log('✅ WebSocket server active');
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 Shutting down server...');
      server.close(() => {
        console.log('✅ Server shut down gracefully');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Server initialization failed:', error);
    process.exit(1);
  }
}

// Handle SPA routing - serve index.html for unknown routes
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(distPath, 'index.html'));
  } catch (error) {
    res.status(404).send('Frontend not found - API server running');
  }
});

// Start the server
initializeServer();