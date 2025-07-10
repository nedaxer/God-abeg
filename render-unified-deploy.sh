#!/bin/bash

echo "🚀 Unified Nedaxer Deployment - Frontend + Full Backend"

# Install dependencies with ignore scripts to avoid TypeScript errors
echo "📦 Installing dependencies..."
npm ci --ignore-scripts
npm install -D tsx vite typescript

# Clean previous builds
rm -rf dist/

# Create build directories
mkdir -p dist/public

# Build React frontend
echo "🎨 Building React frontend..."
npx vite build --outDir=dist/public --mode=production

# Verify frontend build
if [ ! -f "dist/public/index.html" ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend build successful ($(du -sh dist/public | cut -f1))"

# Copy server files for full backend functionality
echo "🔧 Copying complete server files..."
cp -r server dist/
cp package.json dist/
cp -r shared dist/ 2>/dev/null || true

# Create production package.json for server
cat > dist/package.json << 'EOF'
{
  "name": "nedaxer-production",
  "type": "module",
  "scripts": {
    "start": "tsx server/index.ts"
  },
  "dependencies": {
    "tsx": "latest",
    "express": "latest",
    "dotenv": "latest",
    "mongodb": "latest",
    "mongoose": "latest",
    "bcrypt": "latest",
    "axios": "latest",
    "ws": "latest",
    "express-session": "latest",
    "connect-mongodb-session": "latest",
    "passport": "latest",
    "passport-google-oauth20": "latest",
    "nodemailer": "latest",
    "zod": "latest"
  }
}
EOF

# Create unified server that serves both frontend and full backend
echo "🔧 Creating unified production server..."
cat > dist/server.js << 'EOF'
// Import the original server but with static file serving
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the original server setup
async function startServer() {
  const { registerRoutes } = await import('./server/routes.mongo.js');
  const express = (await import('express')).default;
  
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));

  // Register all API routes (full backend functionality)
  const server = await registerRoutes(app);

  // Serve static files (frontend)
  app.use(express.static(join(__dirname, 'public')));

  // Handle React Router - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Nedaxer unified server running on port ${PORT}`);
    console.log(`🌐 Frontend: Serving React app`);
    console.log(`🔧 Backend: Full API + MongoDB + WebSocket support`);
  });
}

startServer().catch(console.error);
EOF

echo "✅ Unified deployment build completed!"
echo "📁 Frontend size: $(du -sh dist/public | cut -f1)"
echo "🔧 Server: Full backend with all APIs"
echo "🎯 Ready for Render deployment with complete functionality!"