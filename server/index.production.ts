import 'dotenv/config'; // Load environment variables from .env file
import express, { type Request, Response, NextFunction } from "express";
import path from 'path';
import { registerRoutes } from "./routes.mongo";

const app = express();
app.use(express.json({ limit: '10mb' })); // Increased limit for profile picture uploads
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Logging middleware
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

      console.log(logLine);
    }
  });

  next();
});

// Production static file serving
function serveStatic(app: express.Express) {
  const distPath = path.resolve(process.cwd(), "dist");
  const publicPath = path.join(distPath, "public");
  
  // Serve static files from dist/public
  app.use(express.static(publicPath));
  
  // Handle client-side routing
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // Serve index.html for all other routes
    const indexPath = path.join(publicPath, "index.html");
    res.sendFile(indexPath);
  });
}

(async () => {
  try {
    console.log('🚀 Starting Nedaxer Trading Platform...');
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌍 Port: ${process.env.PORT || 5000}`);
    
    // Register routes
    const server = await registerRoutes(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error('Error:', err);
      res.status(status).json({ message });
    });

    // Serve static files in production
    serveStatic(app);

    // Use PORT environment variable for deployment (Render) or default to 5000
    const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      console.log(`✅ Nedaxer Trading Platform running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Server initialization error:', error);
    process.exit(1);
  }
})();