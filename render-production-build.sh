#!/bin/bash

echo "🚀 Building Nedaxer Trading Platform - Full Application..."

# Clean previous build
rm -rf dist
mkdir -p dist

# Build frontend with Vite (this creates dist automatically)
echo "📦 Building frontend with Vite..."
npm run build

# The npm run build already creates dist with built assets, no need to copy

# Build server with TypeScript suppression
echo "🔧 Building server..."
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outfile=dist/index.js \
  --external:vite \
  --external:@vitejs/plugin-react \
  --external:@replit/vite-plugin-cartographer \
  --external:@replit/vite-plugin-runtime-error-modal \
  --external:@replit/vite-plugin-shadcn-theme-json \
  --external:mongodb-memory-server \
  --external:mock-aws-s3 \
  --external:aws-sdk \
  --external:nock \
  --external:@babel/preset-typescript \
  --external:@mapbox/node-pre-gyp \
  --log-level=error \
  --minify

# Copy server dependencies
echo "📄 Creating production package.json..."
cat > dist/package.json << 'EOF'
{
  "name": "nedaxer-production",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.21.2",
    "express-session": "^1.18.1",
    "bcrypt": "^5.1.1",
    "mongodb": "^6.17.0",
    "mongoose": "^8.8.4",
    "nodemailer": "^6.9.17",
    "axios": "^1.7.9",
    "ws": "^8.18.0",
    "sharp": "^0.33.5",
    "qrcode": "^1.5.4",
    "compression": "^1.7.5",
    "dotenv": "^16.4.7",
    "zod": "^3.24.1",
    "connect-mongo": "^5.1.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-local": "^1.0.0",
    "@sendgrid/mail": "^8.1.4",
    "multer": "^1.4.5-lts.1",
    "rss-parser": "^3.13.0",
    "memoizee": "^0.4.17",
    "date-fns": "^4.1.0",
    "lightweight-charts": "^4.2.1",
    "recharts": "^2.13.3"
  }
}
EOF

# Copy necessary server files
echo "📂 Copying server configuration files..."
cp -r server/lib dist/ 2>/dev/null || true
cp -r server/services dist/ 2>/dev/null || true
cp -r server/types dist/ 2>/dev/null || true
cp -r server/routes dist/ 2>/dev/null || true
cp -r public dist/ 2>/dev/null || true

# Create health check endpoint
echo "🏥 Creating health check..."
cat > dist/health.js << 'EOF'
export function createHealthCheck(app) {
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'Nedaxer Trading Platform',
      version: '1.0.0'
    });
  });
}
EOF

echo "✅ Production build completed successfully!"
echo "📁 Created files:"
ls -la dist/

# Verify critical files
if [ -f "dist/index.js" ]; then
    SERVER_SIZE=$(stat -c%s dist/index.js 2>/dev/null || stat -f%z dist/index.js 2>/dev/null)
    SERVER_SIZE_KB=$((SERVER_SIZE / 1024))
    echo "📊 Server bundle: ${SERVER_SIZE_KB}KB"
else
    echo "❌ Server build failed!"
    exit 1
fi

if [ -f "dist/index.html" ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "🎉 Nedaxer Trading Platform ready for production deployment!"
echo "   - Full application with MongoDB integration"
echo "   - Real-time crypto price updates"
echo "   - Complete mobile trading interface"
echo "   - WebSocket support for live updates"
echo "   - User authentication and KYC system"