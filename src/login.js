import express from 'express';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore'; // Import the getFirestore function
import path from 'path';
import { fileURLToPath } from 'url'; // Import the fileURLToPath function


// Firebase configuration
const firebaseConfig = {
  // Your Firebase config here
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
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Create an Express app
const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// Set the views directory (optional, you can specify your own directory)
// Use the fileURLToPath function to convert the import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../')));

// Firestore instance
const db = getFirestore();

// Route for user registration
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Create a new user in Firebase Authentication
  firebase.auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log('User created:', user.uid);

      // Save user data to Firestore
      const userDocRef = db.collection('users').doc(user.uid);
      const userData = {
        email: user.email,
        // Add any other user data you want to save
      };

      userDocRef.set(userData)
        .then(() => {
          res.status(201).json({ message: 'User registered successfully!', userId: user.uid });
        })
        .catch((error) => {
          res.status(500).json({ error: 'Error saving user data.' });
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(500).json({ error: errorMessage });
    });
});


// Route for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // You may want to add validation here

 // Authenticate user with Firebase Authentication
 firebase.auth.signInWithEmailAndPassword(email, password)
 .then((userCredential) => {
   // Signed in successfully
   const user = userCredential.user;
   console.log('User logged in:', user.uid);

   // You can add additional actions after successful login if needed

   res.status(200).json({ message: 'Login successful!', userId: user.uid });
 })
 .catch((error) => {
   const errorCode = error.code;
   const errorMessage = error.message;
   res.status(401).json({ error: 'Invalid credentials.' });
 });
});

// Start the server
const port = 3000; // Choose any port number you like
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
