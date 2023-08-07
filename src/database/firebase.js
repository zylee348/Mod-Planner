import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuF0hBXPPkIMvOWKHlHX8X-5Co2PshBI8",
  authDomain: "upsize-76241.firebaseapp.com",
  projectId: "upsize-76241",
  storageBucket: "upsize-76241.appspot.com",
  messagingSenderId: "156240487309",
  appId: "1:156240487309:web:51bb33b3c0809a464993c4",
  measurementId: "G-T5P5JMKZWB",
  databaseURL: "https://upsize-76241-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const database = getDatabase(app);
const auth = getAuth(app);
export {db, database, app, auth};