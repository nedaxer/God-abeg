#!/bin/bash

# Production Build Script - Replaces npm run build with fixed configuration
# This script addresses MongoDB and Vite import errors in ESBuild

echo "🚀 Starting Nedaxer production build..."

# Step 1: Build frontend with Vite
echo "📦 Building frontend..."
npx vite build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend build completed"

# Step 2: Build server with optimized ESBuild configuration
echo "🔧 Building server with fixed import configuration..."

npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --external:vite \
  --external:mongodb \
  --external:mongodb-memory-server \
  --external:mongoose \
  --external:mock-aws-s3 \
  --external:aws-sdk \
  --external:nock \
  --external:@babel/preset-typescript \
  --external:@mapbox/node-pre-gyp

if [ $? -eq 0 ]; then
    echo "✅ Server build completed successfully!"
    echo "📁 Build outputs:"
    echo "  - Frontend: dist/public/"
    echo "  - Server: dist/index.js"
    
    # Display build summary
    if [ -f "dist/index.js" ]; then
        BUILD_SIZE=$(stat -f%z dist/index.js 2>/dev/null || stat -c%s dist/index.js 2>/dev/null)
        BUILD_SIZE_KB=$((BUILD_SIZE / 1024))
        echo "  - Server bundle: ${BUILD_SIZE_KB}KB"
    fi
    
    echo ""
    echo "🎉 Production build ready!"
    echo "To start: npm start"
else
    echo "❌ Server build failed"
    exit 1
fi