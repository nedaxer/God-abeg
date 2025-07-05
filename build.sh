#!/bin/bash

# Nedaxer Build Script for Render Deployment
echo "🏗️ Starting Nedaxer build process..."

# Install dependencies as per user's working process
echo "📦 Installing client dependencies..."
cd client && npm install

echo "📦 Installing server dependencies..."
cd ../server && npm install

echo "📦 Installing root dependencies..."
cd .. && npm install

# Build frontend
echo "🎨 Building frontend with Vite..."
npm run build:client || vite build

# Build backend to match Render's expected path
echo "⚙️ Building backend server..."
mkdir -p server/dist
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=server/dist/index.js

echo "✅ Build completed successfully!"
echo "📁 Server built to: server/dist/index.js"
echo "📁 Frontend built to: dist/"

# Verify build outputs
if [ -f "server/dist/index.js" ]; then
    echo "✅ Server build verified"
else
    echo "❌ Server build failed"
    exit 1
fi

if [ -d "dist" ]; then
    echo "✅ Frontend build verified"
else
    echo "❌ Frontend build failed"
    exit 1
fi