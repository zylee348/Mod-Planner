import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { app as firebase , db } from "../../database/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {addDoc, collection} from "firebase/firestore";

let STUDENT_NUMBERREG = 0;

const RegistrationPage = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // const auth = getAuth();

  const handleStudentNumberChange = (event) => {
    setStudentNumber(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add your registration logic here, e.g., API call, form validation, etc.
    STUDENT_NUMBERREG = studentNumber;
    console.log('Student Number:', STUDENT_NUMBERREG);
    console.log('Password:', password);
    try {
      // Create the user in Firebase Authentication with email and password
      const auth = createUserWithEmailAndPassword(firebase, studentNumber, password);
      // createUserWithEmailAndPassword(auth, studentNumber, password)
      //   .then((userCredential) => {
      // // Signed in 
      // const user = userCredential.user;
      // // ...
      //   });
      const {user} = auth;

      //Store user credentials into db
      await addDoc(collection(db, 'users'), 
      {
        studentNumber: studentNumber,
        password: password,
      });

      // Registration successful, navigate to "/home" or any other page you want
      navigate('/home');
    } catch (error) {
      // Handle registration failure (e.g., show error message)
      console.log('Error occurred during registration:', error);
    }
  };

  return (
    <div>
      <h1>Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="studentNumber">Student Number:</label>
          <input
            type="text"
            id="studentNumber"
            value={studentNumber}
            onChange={handleStudentNumberChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export {STUDENT_NUMBERREG};
export default RegistrationPage;
