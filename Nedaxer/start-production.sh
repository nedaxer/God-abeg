#!/bin/bash

# Production start script - bypasses TypeScript prestart checks
# Runs the production server directly without npm start complications

echo "🚀 Starting Nedaxer in production mode..."

# Check if production build exists
if [ ! -f "dist/index.js" ]; then
    echo "❌ Production build not found. Run ./build-production-no-typecheck.sh first"
    exit 1
fi

# Start production server
echo "🌟 Launching server..."
NODE_ENV=production node dist/index.js