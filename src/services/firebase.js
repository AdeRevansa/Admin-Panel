// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// !! REPLACE WITH YOUR OWN CONFIG FROM THE FIREBASE CONSOLE !!
const firebaseConfig = {
  apiKey: "AIzaSyA6-kW6zFOquVPw2gkW3oUPQEIuIfqw7xk",
  authDomain: "admin-panel-28903.firebaseapp.com",
  projectId: "admin-panel-28903",
  storageBucket: "admin-panel-28903.firebasestorage.app",
  messagingSenderId: "661013378950",
  appId: "1:661013378950:web:e943353aba0b2d5a241e07",
  measurementId: "G-2JEFWRQK80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Optional, for file uploads