import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { app as firebase , db } from "../../database/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {addDoc, collection} from "firebase/firestore";

const RegistrationPage = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleStudentNumberChange = (event) => {
    setStudentNumber(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    // Add your registration logic here, e.g., API call, form validation, etc.
    console.log('Student Number:', studentNumber);
    console.log('Password:', password);
    if (password.length < 6) {
      setError('Password must be at least 6 characters long!');
      throw new Error('Password length too short');
    }
    try {
      // Create the user in Firebase Authentication with email and password
      // const userDetails = createUserWithEmailAndPassword(auth, studentNumber + '@gmail.com', password);
      await createUserWithEmailAndPassword(auth, studentNumber + '@gmail.com', password)
        .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      //Store user credentials into db
      return addDoc(collection(db, 'users'), 
      {
        studentNumber: studentNumber,
        password: password,
        uid: user.uid,
        moduleData: [{
          moduleCode: "CS1010",
          MCs: "4",
        },
        {
          moduleCode: "MA2001",
          MCs: "4",
        },],
      });
        })
      .then(() => {
        // Registration successful, navigate to "/login" or any other page you want
        navigate('/login');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });

    } catch (error) {
      // Handle registration failure (e.g., show error message)
      console.log('Error occurred during registration:', error);
    }
  };

  function ErrorPopup({ errorMessage, onClose }) {
    return (
      <div className="error-popup">
        <p>{errorMessage}</p>
        <button onClick={onClose}>Dismiss</button>
      </div>
    );
  }

  const dismissError = () => {
    setError(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Registration</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="studentNumber">
            Student Number:
          </label>
          <br />
          <input
            type="text"
            id="studentNumber"
            value={studentNumber}
            onChange={handleStudentNumberChange}
            required
            style={{ width: '300px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">
            Password:
          </label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
            style={{ width: '300px', padding: '5px' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
          <button type="submit" style={{ width: '150px' }}>Register</button>
        </div>
      </form>
      {error && <ErrorPopup errorMessage={error} onClose={dismissError} />}
    </div>
  );
};

export default RegistrationPage;
