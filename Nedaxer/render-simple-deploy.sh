#!/bin/bash

echo "🚀 Nedaxer Trading Platform - Simple Deployment"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build frontend
echo "🔧 Building frontend..."
npm run build 2>/dev/null || npx vite build

echo "✅ Deployment ready!"
echo "📋 Server will start with tsx server/index.ts"