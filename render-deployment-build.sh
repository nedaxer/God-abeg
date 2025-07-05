#!/bin/bash

# Comprehensive Render Deployment Build Script
# Addresses TypeScript compilation issues and proper port binding

echo "🚀 Starting Render deployment build..."

# Memory optimization for Render starter plan
export NODE_OPTIONS="--max-old-space-size=1024"

# Install all dependencies (production + development for build)
echo "📦 Installing dependencies..."
npm ci

# Build frontend with Vite
echo "🔧 Building frontend with Vite..."
npx vite build

# Verify frontend build exists
if [ ! -d "dist" ]; then
    echo "❌ Frontend build failed - no dist directory created"
    exit 1
fi

# Build server with comprehensive external dependencies (using production entry point)
echo "🔧 Building server with external dependencies..."
npx esbuild server/index.production.ts \
  --platform=node \
  --bundle \
  --format=esm \
  --outfile=dist/index.js \
  --external:vite \
  --external:mongodb \
  --external:mongodb-memory-server \
  --external:mongoose \
  --external:sharp \
  --external:bufferutil \
  --external:utf-8-validate \
  --external:mock-aws-s3 \
  --external:aws-sdk \
  --external:nock \
  --external:@babel/preset-typescript \
  --external:@mapbox/node-pre-gyp \
  --external:@vitejs/plugin-react \
  --external:@replit/vite-plugin-cartographer \
  --external:@replit/vite-plugin-runtime-error-modal \
  --log-level=warning

# Verify server build exists
if [ ! -f "dist/index.js" ]; then
    echo "❌ Server build failed - no dist/index.js created"
    exit 1
fi

# Create production package.json for dist directory
echo "📝 Creating production package.json..."
cat > dist/package.json << EOF
{
  "name": "nedaxer-server",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "mongodb": "^6.17.0",
    "mongoose": "^8.16.1",
    "express": "^4.21.2",
    "express-session": "^1.18.1",
    "bcrypt": "^5.1.1",
    "sharp": "^0.34.1",
    "ws": "^8.18.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-local": "^1.0.0",
    "nodemailer": "^6.10.1",
    "axios": "^1.9.0",
    "compression": "^1.8.0",
    "multer": "^2.0.1",
    "qrcode": "^1.5.4",
    "bitcoinjs-lib": "^6.1.7",
    "bip32": "^5.0.0-rc.0",
    "bip39": "^3.1.0",
    "dotenv": "^16.5.0",
    "zod": "^3.23.8",
    "bufferutil": "^4.0.8"
  }
}
EOF

# Display build information
echo "✅ Build completed successfully!"
echo "📁 Frontend: dist/ (static files)"
echo "📁 Server: dist/index.js"
echo "📦 Build size information:"
ls -la dist/
echo ""
echo "🎯 Ready for Render deployment!"
echo "   - Frontend and backend both built to dist/"
echo "   - Server will run on PORT environment variable"
echo "   - MongoDB connection via MONGODB_URI"
echo "   - All external dependencies properly configured"