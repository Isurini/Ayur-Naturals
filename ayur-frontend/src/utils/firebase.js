// src/utils/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDK1AYfKQZj6ZXuRAdSTA3SDUsb7Si67JY",
  authDomain: "ayur-naturals.firebaseapp.com",
  projectId: "ayur-naturals",
  storageBucket: "ayur-naturals.firebasestorage.app",
  messagingSenderId: "163070219774",
  appId: "1:163070219774:web:1820629cebe28606d05caf",
  measurementId: "G-16JFQ5EFBC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//  Firebase Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export for use in Login.jsx
export { auth, googleProvider };
