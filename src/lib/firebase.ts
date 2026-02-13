
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDDPypizcfYalaJ-IQtXxt60hm85x1lB4s",
    authDomain: "cookmytech.firebaseapp.com",
    projectId: "cookmytech",
    storageBucket: "cookmytech.firebasestorage.app",
    messagingSenderId: "984972201120",
    appId: "1:984972201120:web:70a506d3dbf35d40aa0dc5",
    measurementId: "G-DJY2P46888"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
