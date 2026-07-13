import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log('🔥 Application starting...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Remove StrictMode to prevent double mounting issues
ReactDOM.createRoot(rootElement).render(<App />);

console.log('✅ React rendered');