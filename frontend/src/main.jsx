import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'
import { AuthProvider } from './context/AuthContext.jsx'

// Axios interceptor for authentication
axios.interceptors.request.use((request)=>{
  if(localStorage.getItem("token")){
    request.headers.Authorization = localStorage.getItem("token")
  }
  return request;
})

// Global PWA Install Prompt Handler
// Initialize this BEFORE React loads to capture the event early
window.deferredPrompt = null;
window.isPWAInstallable = false;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('🎯 [MAIN.JSX] beforeinstallprompt event captured!');
  e.preventDefault();
  window.deferredPrompt = e;
  window.isPWAInstallable = true;
  console.log('✅ [MAIN.JSX] Install prompt saved globally');

  // Dispatch custom event so components can react
  window.dispatchEvent(new CustomEvent('pwa-installable'));
});

window.addEventListener('appinstalled', () => {
  console.log('🎉 [MAIN.JSX] PWA installed successfully!');
  window.deferredPrompt = null;
  window.isPWAInstallable = false;

  // Dispatch custom event
  window.dispatchEvent(new CustomEvent('pwa-installed'));
});

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ [MAIN.JSX] Service Worker registered:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      })
      .catch((error) => {
        console.error('❌ [MAIN.JSX] Service Worker registration failed:', error);
      });
  });
} else {
  console.warn('⚠️ [MAIN.JSX] Service Worker not supported in this browser');
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
