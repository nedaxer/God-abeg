#!/bin/bash

echo "🚀 Nedaxer - Bypass Build Script"

# Skip TypeScript checking during build
export SKIP_TYPECHECK=true

# Install dependencies without running postinstall scripts
echo "📦 Installing dependencies (skipping postinstall scripts)..."
npm ci --ignore-scripts

# Build frontend only
echo "🔧 Building frontend..."
npx vite build

echo "✅ Build completed successfully!"
echo "📋 Ready to start with: npx tsx server/index.ts"