#!/bin/bash

# Quick build fix - just build the server with correct configuration
# Frontend already built successfully, only server has import issues

echo "🔧 Building server with fixed MongoDB and Vite imports..."

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
  --external:@mapbox/node-pre-gyp

if [ $? -eq 0 ]; then
    echo "✅ Server build completed successfully!"
    
    # Show build info
    if [ -f "dist/index.js" ]; then
        BUILD_SIZE=$(stat -f%z dist/index.js 2>/dev/null || stat -c%s dist/index.js 2>/dev/null)
        BUILD_SIZE_KB=$((BUILD_SIZE / 1024))
        echo "📦 Server bundle: ${BUILD_SIZE_KB}KB"
    fi
    
    echo "🎉 Build fixed! No more MongoDB/Vite import errors."
else
    echo "❌ Server build failed"
    exit 1
fi