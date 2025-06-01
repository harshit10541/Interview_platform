// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7ByyeufwnzDgoeCo-EQW1Yhq1H3eUljo",
  authDomain: "prepwise2501.firebaseapp.com",
  databaseURL: "https://prepwise2501-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "prepwise2501",
  storageBucket: "prepwise2501.firebasestorage.app",
  messagingSenderId: "922038595533",
  appId: "1:922038595533:web:e58671883622f356e1de84",
  measurementId: "G-V7KT51BZL2"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);