#!/bin/bash

# Simplified Render Build Script - No TypeScript Checking
echo "🚀 Starting Render build (TypeScript check disabled)..."

# Memory optimization for Render
export NODE_OPTIONS="--max_old_space_size=1024"

# Install without running postinstall scripts (skips TypeScript check)
echo "📦 Installing dependencies..."
npm ci --ignore-scripts --only=production=false

# Build frontend with Vite (outputs to dist/)
echo "🔧 Building frontend..."
npx vite build --logLevel=error

# Verify frontend build
if [ ! -d "dist" ]; then
    echo "❌ Frontend build failed - no dist directory created"
    exit 1
fi

# Build server with bundled dependencies (outputs to dist/index.js)
echo "🔧 Building server..."
npx esbuild server/index.ts \
  --platform=node \
  --bundle \
  --format=esm \
  --outfile=dist/index.js \
  --external:sharp \
  --external:bufferutil \
  --external:utf-8-validate \
  --log-level=error

# Verify server build
if [ ! -f "dist/index.js" ]; then
    echo "❌ Server build failed - no dist/index.js created"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Frontend: dist/ (static files)"
echo "📁 Server: dist/index.js"
ls -la dist/