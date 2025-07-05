#!/bin/bash

echo "🚀 Starting Nedaxer production build..."
echo "📦 Cleaning previous builds..."
rm -rf dist/ client/dist/

echo "🔧 Installing dependencies (skipping scripts)..."
npm install --ignore-scripts

echo "🔧 Manually installing critical build dependencies..."
npm install vite@6.0.5 typescript@5.7.3 @vitejs/plugin-react@4.3.4 --save-dev

echo "📦 Building frontend..."
npx vite build --config vite.config.ts

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo "🔧 Rebuilding native modules for production..."
npm rebuild bcrypt

echo "🏗️ Building server..."
npx esbuild server/index.ts --bundle --platform=node --target=node20 --outfile=dist/index.js \
    --external:vite --external:mongodb --external:mongoose --external:mongodb-memory-server \
    --external:express --external:nodemailer --external:bcrypt --external:ws --external:sharp \
    --external:qrcode --external:axios --external:dotenv --external:compression \
    --external:express-session --external:passport --external:passport-local \
    --external:passport-google-oauth20 --external:connect-mongo --external:@sendgrid/mail \
    --external:openai --external:@azure-rest/ai-inference --external:@azure/core-auth \
    --minify --format=cjs

if [ $? -eq 0 ]; then
    echo "✅ Server build successful!"
    echo "📊 Build complete! Server bundle ready for deployment."
else
    echo "❌ Server build failed"
    exit 1
fi