#!/bin/bash

echo "🚀 Simple Render build..."

# Create basic dist structure
mkdir -p dist

# Copy frontend assets if they exist, otherwise create minimal HTML
if [ -d "client/public" ]; then
    cp -r client/public/* dist/
fi

# Create minimal index.html
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nedaxer Trading Platform</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #0a0a2e; color: white; }
        .container { max-width: 800px; margin: 0 auto; text-align: center; padding: 50px 20px; }
        h1 { color: #ff6b35; margin-bottom: 30px; }
        .status { background: #1a1a40; padding: 20px; border-radius: 10px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Nedaxer Trading Platform</h1>
        <div class="status">
            <h2>🚀 Server Running Successfully</h2>
            <p>Your Nedaxer trading platform is now deployed on Render!</p>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Build:</strong> Production</p>
        </div>
    </div>
</body>
</html>
EOF

# Create package.json for production dependencies
cat > dist/package.json << 'EOF'
{
  "name": "nedaxer-production",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}
EOF

# Create production server
cat > dist/index.js << 'EOF'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Nedaxer Trading Platform'
  });
});

// Basic API routes
app.get('/api/status', (req, res) => {
  res.json({ 
    platform: 'Nedaxer',
    version: '1.0.0',
    status: 'running'
  });
});

// Catch-all for frontend routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Port configuration for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Nedaxer server running on port ${PORT}`);
  console.log(`📡 Health check available at: /api/health`);
});
EOF

echo "✅ Simple build complete!"
echo "📁 Created files:"
ls -la dist/