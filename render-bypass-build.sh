#!/bin/bash

echo "🚀 Nedaxer - Complete Build Script"

# Set memory limit for build process
export NODE_OPTIONS="--max-old-space-size=1024"

# Install ALL dependencies including devDependencies for build
echo "📦 Installing all dependencies..."
npm ci

# Build frontend with proper vite installation
echo "🔧 Building frontend..."
npx vite build

# Verify build output
if [ -d "dist" ]; then
    echo "✅ Frontend build successful - dist directory created"
    ls -la dist/
else
    echo "❌ Frontend build failed - no dist directory"
    exit 1
fi

# Rebuild native modules for production environment
echo "🔧 Rebuilding native modules..."
npm rebuild

echo "✅ Build completed successfully!"
echo "📋 Ready to start with: npx tsx server/index.production.ts"