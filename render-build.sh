#!/bin/bash

# Render.com Optimized Build Script
# Designed to work within Render's memory constraints and build environment

echo "🚀 Starting Render deployment build..."

# Set Node memory limit for Render environment
export NODE_OPTIONS="--max_old_space_size=1024"

# Skip TypeScript checking during Render deployment to avoid memory issues
export SKIP_TYPESCRIPT_CHECK=true

# Step 1: Install dependencies (skip postinstall TypeScript check)
echo "📦 Installing dependencies..."
npm install --production=false --ignore-scripts

if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed"
    exit 1
fi

echo "✅ Dependencies installed successfully (TypeScript check skipped for production)"

# Step 2: Build frontend (Vite build)
echo "🔧 Building frontend with Vite..."
npx vite build --logLevel=error

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend build completed"

# Step 3: Build server with optimized ESBuild configuration
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
  --external:@mapbox/node-pre-gyp \
  --external:node-gyp \
  --external:fsevents \
  --log-level=error

if [ $? -eq 0 ]; then
    echo "✅ Server build completed successfully"
    
    # Display build info
    if [ -f "dist/index.js" ]; then
        BUILD_SIZE=$(stat -c%s dist/index.js 2>/dev/null || stat -f%z dist/index.js 2>/dev/null)
        BUILD_SIZE_KB=$((BUILD_SIZE / 1024))
        echo "📊 Build summary:"
        echo "  - Frontend: dist/public/ (static assets)"
        echo "  - Server: dist/index.js (${BUILD_SIZE_KB}KB)"
    fi
    
    echo "🎉 Render build completed successfully!"
    echo "Application ready for deployment"
else
    echo "❌ Server build failed"
    exit 1
fi