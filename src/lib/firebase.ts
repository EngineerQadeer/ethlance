// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { shouldUseFirebase } from './storage-config';

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-2656924394-cfdb1",
  "appId": "1:442081158653:web:e3d6064f83ed2a4ec86594",
  "storageBucket": "studio-2656924394-cfdb1.firebasestorage.app",
  "apiKey": "AIzaSyCdaBW4ECyG_IRD2EtTQxO82GRQjhqDEMI",
  "authDomain": "studio-2656924394-cfdb1.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "442081158653"
};

// Initialize Firebase only if needed
let app: any = null;
let db: any = null;

// Only initialize Firebase if we should use it
if (shouldUseFirebase()) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialized for production');
  } catch (error) {
    console.warn('Failed to initialize Firebase:', error);
    app = null;
    db = null;
  }
} else {
  console.log('Using localStorage for development - Firebase disabled');
}

export { db };
