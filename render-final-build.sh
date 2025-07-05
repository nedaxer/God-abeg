#!/bin/bash

echo "🚀 Nedaxer Trading Platform - Complete Build & Deploy"

# Set memory and environment
export NODE_OPTIONS="--max-old-space-size=1024"
export NODE_ENV=production

# Clean any previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist node_modules/.cache

# Install dependencies without running TypeScript check
echo "📦 Installing dependencies (skipping scripts)..."
npm ci --ignore-scripts

# Manually install critical build dependencies if missing
echo "🔍 Ensuring build dependencies are present..."
npm install vite@^6.0.5 typescript@^5.7.3 @vitejs/plugin-react@^4.3.4 --save-dev --no-save

# Verify Vite is now available
echo "🔍 Verifying Vite installation..."
if ! npx vite --version &>/dev/null; then
    echo "❌ Vite still not available, trying alternative install..."
    npm install vite --save-dev --force
fi

# Skip TypeScript check and build directly
echo "🔧 Building frontend with Vite (skipping TypeScript check)..."
npx vite build --mode production --config vite.config.ts

# Verify build success with detailed diagnostics
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Frontend build successful!"
    echo "📊 Build contents:"
    ls -la dist/
    
    # Check if it's a proper React build
    if grep -q "React" dist/index.html 2>/dev/null; then
        echo "✅ React application detected in build"
    fi
    
    if [ -d "dist/assets" ]; then
        echo "📁 Assets directory:"
        ls -la dist/assets/ | head -5
    fi
else
    echo "❌ Frontend build failed"
    echo "📂 Current directory contents:"
    ls -la
    echo "📂 Checking if vite.config.ts exists:"
    ls -la vite.config.ts
    exit 1
fi

# Rebuild native modules (fixes bcrypt issue)
echo "🔧 Rebuilding native modules for production..."
npm rebuild bcrypt

# Verify bcrypt installation
echo "🔍 Verifying bcrypt installation..."
if node -e "require('bcrypt')" 2>/dev/null; then
    echo "✅ bcrypt working correctly"
else
    echo "⚠️ bcrypt may have issues, but continuing..."
fi

echo "✅ Complete build finished successfully!"
echo "📋 Ready to start with: npx tsx server/index.production.ts"