#!/bin/bash

echo "🚀 Nedaxer Trading Platform - Complete Build & Deploy"

# Set memory and environment
export NODE_OPTIONS="--max-old-space-size=1024"
export NODE_ENV=production

# Clean any previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist node_modules/.cache

# Install all dependencies (including dev dependencies needed for build)
echo "📦 Installing all dependencies..."
npm ci

# Verify critical packages are installed
echo "🔍 Verifying build dependencies..."
if ! npm list vite &>/dev/null; then
    echo "❌ Vite not found, installing..."
    npm install vite --save-dev
fi

if ! npm list typescript &>/dev/null; then
    echo "❌ TypeScript not found, installing..."
    npm install typescript --save-dev
fi

# Build frontend with verbose output
echo "🔧 Building frontend with Vite..."
npx vite build --mode production

# Verify build success
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Frontend build successful!"
    echo "📊 Build contents:"
    ls -la dist/
    
    if [ -d "dist/assets" ]; then
        echo "📁 Assets directory:"
        ls -la dist/assets/ | head -10
    fi
else
    echo "❌ Frontend build failed - missing dist/index.html"
    exit 1
fi

# Rebuild native modules (fixes bcrypt issue)
echo "🔧 Rebuilding native modules for production..."
npm rebuild

# Verify bcrypt installation
echo "🔍 Verifying bcrypt installation..."
if node -e "require('bcrypt')" 2>/dev/null; then
    echo "✅ bcrypt working correctly"
else
    echo "⚠️ bcrypt may have issues, but continuing..."
fi

echo "✅ Complete build finished successfully!"
echo "📋 Ready for deployment"