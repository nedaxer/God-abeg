#!/bin/bash

echo "🚀 Nedaxer Production Build for Render"

# Clean build directory
rm -rf dist/

# Create directories
mkdir -p dist/public

# Build frontend with Vite (skip TypeScript checking)
echo "🎨 Building React frontend..."
npx vite build --outDir=dist/public --mode=production

# Verify frontend build
if [ ! -f "dist/public/index.html" ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend build successful"

# Create production server
echo "🔧 Creating production server..."
cat > dist/server.js << 'EOF'
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Handle React Router
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Nedaxer running on port ${PORT}`);
});
EOF

echo "✅ Production build completed!"
echo "📁 Build size: $(du -sh dist/public | cut -f1)"
echo "🎯 Ready for deployment!"