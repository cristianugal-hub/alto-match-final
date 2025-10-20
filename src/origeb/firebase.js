import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDvKBObvJcJlO-MhvCZPBqDB822pE5ALqM",
  authDomain: "altomatchchat.firebaseapp.com",
  databaseURL: "https://altomatchchat-default-rtdb.firebaseio.com",
  projectId: "altomatchchat",
  storageBucket: "altomatchchat.firebasestorage.app",
  messagingSenderId: "249323841527",
  appId: "1:249323841527:web:6dd290a540b067be6af0f2"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
