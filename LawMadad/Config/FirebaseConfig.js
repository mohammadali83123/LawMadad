import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "lawmadad-ad261.firebaseapp.com",
  projectId: "lawmadad-ad261",
  storageBucket: "lawmadad-ad261.firebasestorage.app",
  messagingSenderId: "562895718428",
  appId: "1:562895718428:web:e6ca680744f0a4975f77d9",
  measurementId: "G-ZFGE219P1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Ensure Auth is only initialized once
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  auth = getAuth(app); // Fallback if already initialized
}

// Firestore database (exported as 'firestore' for use in loginScreen)
const firestore = getFirestore(app);

export { auth, firestore };