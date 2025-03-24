import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNDbHtEIk3q0q31c89PPplX_JDoAi770Y",
  authDomain: "iquestionsprep.firebaseapp.com",
  projectId: "iquestionsprep",
  storageBucket: "iquestionsprep.firebasestorage.app",
  messagingSenderId: "227524023526",
  appId: "1:227524023526:web:33c4a3ebd31cba9d1e9727",
  measurementId: "G-SSDSFR50EZ",
};
// Check if Firebase app is already initialized
// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
