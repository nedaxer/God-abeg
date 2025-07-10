import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// PWA functionality removed to fix installation issues

// Render the application
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <App />
  );
}
