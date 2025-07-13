import 'dotenv/config'; // Load environment variables from .env file
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.mongo"; // Using PostgreSQL routes
import { createServer } from "http";

// Simple log function for production
const log = (message: string, source = "express") => {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
};

// Conditionally import Vite functions
async function getViteFunctions() {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const viteModule = await import("./vite");
      return {
        setupVite: viteModule.setupVite,
        serveStatic: viteModule.serveStatic,
        log: viteModule.log
      };
    } catch (error) {
      console.log('Vite not available, running in production mode');
      return { setupVite: null, serveStatic: null, log };
    }
  }
  return { setupVite: null, serveStatic: null, log };
}

// Helper function to find an available port
async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(startPort, () => {
      const port = (server.address() as any)?.port;
      server.close(() => {
        resolve(port);
      });
    });
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Port is in use, try the next one
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
}

const app = express();
app.use(express.json({ limit: '10mb' })); // Increased limit for profile picture uploads
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Initialize proactive crypto price fetcher for file-based caching
(async () => {
  try {
    const { proactiveFetcher } = await import('./services/proactive-price-fetcher.js');
    console.log('🚀 Proactive crypto price fetcher initialized');
  } catch (error) {
    console.error('❌ Failed to initialize proactive fetcher:', error);
  }
})();

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Register routes with PostgreSQL
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // Get Vite functions conditionally
    const { setupVite, serveStatic } = await getViteFunctions();
    
    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development" && setupVite) {
      await setupVite(app, server);
    } else if (serveStatic) {
      serveStatic(app);
    } else {
      // Production mode - serve built React app
      const path = await import('path');
      const distPath = path.resolve(process.cwd(), 'dist', 'public');
      
      try {
        // Check if build directory exists
        const fs = await import('fs');
        if (fs.existsSync(distPath)) {
          // Serve static files
          app.use(express.static(distPath));
          
          // Handle React Router - serve index.html for all non-API routes
          app.get('*', (req, res) => {
            res.sendFile(path.resolve(distPath, 'index.html'));
          });
          
          console.log('✅ Serving production React app from:', distPath);
        } else {
          console.log('⚠️  Production build not found, serving minimal HTML');
          // Fallback HTML with redirect to mobile app
          app.get('*', (req, res) => {
            res.send(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Nedaxer Trading Platform</title>
                <style>
                  body { margin: 0; font-family: Arial, sans-serif; background: #0a0a2e; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; }
                  .loading { text-align: center; }
                  .subtitle { opacity: 0.8; margin-top: 10px; }
                </style>
              </head>
              <body>
                <div class="loading">
                  <h1>Nedaxer Trading Platform</h1>
                  <p class="subtitle">Loading your trading interface...</p>
                  <p>✅ Real-time prices for 106+ cryptocurrencies</p>
                  <p>✅ Advanced mobile trading interface</p>
                  <p>✅ Secure user authentication & KYC</p>
                </div>
                <script>
                  // Redirect to mobile app
                  setTimeout(() => {
                    if (window.location.pathname === '/') {
                      window.location.href = '/mobile';
                    }
                  }, 3000);
                </script>
              </body>
              </html>
            `);
          });
        }
      } catch (error) {
        console.error('Error setting up production static serving:', error);
        app.get('*', (req, res) => {
          res.json({ 
            message: 'Nedaxer API Server Running',
            endpoints: [
              '/api/crypto/realtime-prices',
              '/api/auth/login',
              '/api/user/balance',
              '/api/wallet/summary'
            ]
          });
        });
      }
    }



    // Use PORT environment variable for deployment (Render) or default to 5000
    const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error('Server initialization error:', error);
    process.exit(1);
  }
})();