const express = require('express');
const path = require('path');

const app = express();

// Simple test for serving static files
app.use(express.static('dist'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Test server running' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running on port ${port}`);
});