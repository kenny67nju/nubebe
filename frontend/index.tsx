
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppWithAuth from './AppWithAuth';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Toggle between authenticated app and original app
// Set USE_AUTH to true to enable authentication
const USE_AUTH = true; // Change to true to enable authentication

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {USE_AUTH ? <AppWithAuth /> : <App />}
  </React.StrictMode>
);
