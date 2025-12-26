// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCHpQ46cACeXqguCep-4j_NGXzECSo0k-k",
  authDomain: "schoolm-1328f.firebaseapp.com",
  projectId: "schoolm-1328f",
  storageBucket: "schoolm-1328f.firebasestorage.app",
  messagingSenderId: "710514748200",
  appId: "1:710514748200:web:7051ce2d19e85f769a7e1d",
  measurementId: "G-8ZJNSNDM5Z"
};

// VAPID Key for Web Push
export const VAPID_KEY = "BL-xjgMt6XlWKEGuOcdCAJVrBEHGUZqq3ySaeEkdPOlmwj5LYhleyzeyWBY7SQLMFGzAAUu_SOhdCLrLDoc4EdM";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
let messaging = null;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.log("Firebase messaging not supported:", error);
}

export { app, messaging, getToken, onMessage };
