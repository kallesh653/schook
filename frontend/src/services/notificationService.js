import { messaging, getToken, onMessage, VAPID_KEY } from '../firebase/config';
import axios from 'axios';
import { baseUrl } from '../environment';

class NotificationService {
  constructor() {
    this.fcmToken = null;
    this.isSupported = this.checkSupport();
  }

  // Check if notifications are supported
  checkSupport() {
    return (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      messaging !== null
    );
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      console.log('Notifications not supported in this browser');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted');
        return await this.getFCMToken();
      } else {
        console.log('Notification permission denied');
        return null;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return null;
    }
  }

  // Get FCM token
  async getFCMToken() {
    if (!this.isSupported || !messaging) {
      return null;
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log('FCM Token:', token);
        this.fcmToken = token;
        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Save token to backend
  async saveTokenToBackend(token) {
    try {
      const authToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!authToken) {
        console.log('No auth token found');
        return false;
      }

      const response = await axios.post(
        `${baseUrl}/notification/save-token`,
        { fcmToken: token },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      return response.data.success;
    } catch (error) {
      console.error('Error saving FCM token to backend:', error);
      return false;
    }
  }

  // Initialize notifications for authenticated user
  async initializeNotifications() {
    if (!this.isSupported) {
      console.log('Notifications not supported');
      return false;
    }

    try {
      // Check current permission
      if (Notification.permission === 'granted') {
        const token = await this.getFCMToken();
        if (token) {
          await this.saveTokenToBackend(token);
          this.setupForegroundListener();
          return true;
        }
      } else if (Notification.permission === 'default') {
        // Don't request automatically, let user click a button
        return false;
      }
      return false;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  // Setup foreground message listener
  setupForegroundListener() {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);

      const notificationTitle = payload.notification?.title || 'School Management';
      const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: payload.notification?.icon || '/logo.png',
        badge: '/logo.png',
        tag: payload.data?.type || 'general',
        data: payload.data,
        requireInteraction: true
      };

      // Show notification
      if (Notification.permission === 'granted') {
        new Notification(notificationTitle, notificationOptions);
      }

      // Dispatch custom event for app to handle
      window.dispatchEvent(new CustomEvent('fcm-notification', {
        detail: payload
      }));
    });
  }

  // Delete token
  async deleteToken() {
    if (!this.fcmToken || !messaging) return false;

    try {
      // Delete from backend
      const authToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (authToken) {
        await axios.delete(`${baseUrl}/notification/delete-token`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
      }

      this.fcmToken = null;
      return true;
    } catch (error) {
      console.error('Error deleting FCM token:', error);
      return false;
    }
  }

  // Get current permission status
  getPermissionStatus() {
    if (!this.isSupported) return 'unsupported';
    return Notification.permission;
  }
}

export default new NotificationService();
