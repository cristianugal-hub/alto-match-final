// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvKBObvJcJlO-MhvCZPBqDB822pE5ALqM",
  authDomain: "altomatchchat.firebaseapp.com",
  databaseURL: "https://altomatchchat-default-rtdb.firebaseio.com",
  projectId: "altomatchchat",
  storageBucket: "altomatchchat.firebasestorage.app",
  messagingSenderId: "249323841527",
  appId: "1:249323841527:web:6dd290a540b067be6af0f2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

