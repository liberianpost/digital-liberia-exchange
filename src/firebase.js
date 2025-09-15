// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvrjYZMRFFnJRUQKXdkDcRRVdxUpoF8bw",
  authDomain: "digital-liberia-exchange.firebaseapp.com",
  projectId: "digital-liberia-exchange",
  storageBucket: "digital-liberia-exchange.firebasestorage.app",
  messagingSenderId: "1026620150199",
  appId: "1:1026620150199:web:0c4b855805b85a7d9a5832",
  measurementId: "G-ETPMHCZFQV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
