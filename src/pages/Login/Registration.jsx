import React, { useState } from 'react';

const RegistrationPage = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleStudentNumberChange = (event) => {
    setStudentNumber(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add registration logic here, e.g., API call, form validation, etc.
    console.log('Student Number:', studentNumber);
    console.log('Password:', password);
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

export default RegistrationPage;
