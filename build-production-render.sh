#!/bin/bash

# Production build script for Render deployment
echo "🚀 Starting Production Build for Render..."

# Clean any existing build
rm -rf dist/
rm -rf client/dist/
rm -rf server/dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create dist directory
mkdir -p dist/public

# Build React frontend using Vite
echo "🎨 Building React frontend..."
npx vite build --outDir=dist/public

# Verify frontend build
if [ ! -f "dist/public/index.html" ]; then
    echo "❌ Frontend build failed - no index.html found"
    exit 1
fi

# Copy server files to dist
echo "🔧 Preparing server files..."
cp -r server/* dist/ 2>/dev/null || true
cp package.json dist/
cp -r node_modules dist/ 2>/dev/null || true

# Create production server entry point
cat > dist/server.js << 'EOF'
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { registerRoutes } from './routes.mongo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Register API routes
const server = await registerRoutes(app);

// Serve static files from public directory
app.use(express.static(join(__dirname, 'public')));

// Handle all other routes with React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Nedaxer production server running on port ${PORT}`);
});
EOF

# Make server executable
chmod +x dist/server.js

echo "✅ Production build completed successfully!"
echo "📁 Frontend: dist/public/"
echo "🔧 Server: dist/server.js"
echo "🎯 Ready for deployment!"