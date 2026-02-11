import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { registerServiceWorker, initPWAInstall } from './utils/pwa';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker and PWA install prompt
if (import.meta.env.PROD) {
  registerServiceWorker();
  initPWAInstall();
}
