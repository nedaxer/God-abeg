#!/bin/bash

# Build script for Nedaxer server with correct ESBuild configuration
# This script fixes the import issues by using external flags for problematic modules

echo "Building Nedaxer server with fixed import configuration..."

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

echo "Server build completed successfully!"
echo "Built file: dist/index.js"

# Make the script executable
chmod +x build-server.sh