import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

// Enable compression
app.use(compression());

// Serve static files from the client/dist directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');

app.use(express.static(clientDistPath));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Use PORT environment variable or default to 3000
const port = parseInt(process.env.PORT || '3000', 10);

server.listen(port, () => {
  console.log(`✅ Nedaxer production server running on port ${port}`);
});