import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// User's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxZwCMysxMgWh8pOwUvK6QcVyrT72Vq4g",
  authDomain: "fir-5adfb.firebaseapp.com",
  databaseURL: "https://fir-5adfb-default-rtdb.firebaseio.com",
  projectId: "fir-5adfb",
  storageBucket: "fir-5adfb.firebasestorage.app",
  messagingSenderId: "450132587682",
  appId: "1:450132587682:web:d12556516b62b14e8093fb",
  measurementId: "G-WNVF9V9RD8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { database };
