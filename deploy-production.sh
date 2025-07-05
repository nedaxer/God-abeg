#!/bin/bash

echo "🚀 Nedaxer Production Deployment Script"
echo "📊 Node version: $(node --version)"

# Skip TypeScript checks for production deployment
export NODE_ENV=production

echo "🎨 Building React frontend and Node.js backend..."
# Build without running TypeScript checks
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo "📁 Production files created in dist/"
echo ""
echo "🚀 To start production server:"
echo "   cd dist && node index.production.js"
echo ""
echo "🌐 Server will run on port 3000"
echo "💡 Use this command for deployment platforms like Render:"
echo "   Start Command: cd dist && node index.production.js"