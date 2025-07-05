const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Nedaxer Trading Platform',
    version: '1.0.0',
    features: [
      'Real-time crypto prices (106 currencies)',
      'Mobile trading interface',
      'User authentication',
      'MongoDB integration',
      'Admin portal'
    ]
  });
});

// API placeholder endpoints
app.get('/api/crypto/realtime-prices', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Live crypto prices endpoint - requires full server deployment',
    currencies: 106
  });
});

app.get('/api/auth/user', (req, res) => {
  res.status(401).json({ 
    success: false, 
    message: 'Authentication endpoint - requires MongoDB connection' 
  });
});

// Catch all handler
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ 
      error: 'API endpoint not implemented in basic deployment',
      availableEndpoints: ['/api/health', '/api/crypto/realtime-prices', '/api/auth/user']
    });
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Nedaxer Trading Platform running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`🌐 Application: http://localhost:${port}`);
});
