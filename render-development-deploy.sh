#!/bin/bash

echo "🚀 Nedaxer Development Mode Deployment for Render"
echo "📊 Node version: $(node --version)"

# Set development environment (same as working setup)
export NODE_ENV=development

# Install dependencies (including tsx for TypeScript execution)
echo "📦 Installing dependencies..."
npm ci --ignore-scripts

# Verify tsx is available for TypeScript execution
echo "🔧 Verifying tsx installation..."
npx tsx --version || npm install tsx --save-dev

echo "✅ Deployment ready!"
echo "🚀 Starting development server with full backend functionality..."
echo "📡 Server will include:"
echo "   - MongoDB Atlas (106 cryptocurrencies)"
echo "   - Real-time price updates"
echo "   - WebSocket connections"
echo "   - Complete API endpoints"
echo "   - Vite development server"
echo ""
echo "💡 Start command: NODE_ENV=development tsx server/index.ts"