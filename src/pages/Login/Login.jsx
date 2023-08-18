import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { app as firebase, db } from "../../database/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";


const Login = () => {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Cross checking with firestore
      const q = query(collection(db,"users"), where("studentNumber", "==", studentNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty)  {
        console.log("User not registered!");
        return;
      }

      const userData = querySnapshot.docs[0].data();

      if (userData.password === password) {
        // If the login is successful, update the state and navigate to "/home"
        await signInWithEmailAndPassword(auth, studentNumber + '@gmail.com', password);
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        console.log("Wrong password entered, please try again!");
      }

    } catch (error) {
      // Handle login failure (e.g., show error message)
      console.log("Error occurred during login:", error);
    }
  };

  const handleSignUpClick = () => {
    // Navigate to the registration page when the "Sign Up" button is clicked
    navigate("/registration");
  };
  

  // Render the login form if not logged in, or redirect to home if logged in
  if (isLoggedIn) {
    return <Redirect to="/home" />;
  } else {
    return (
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Student Number:
            <input
              type="text"
              value={studentNumber}
              onChange={(event) => setStudentNumber(event.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <br />
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p className="regs">
        <button type="button" onClick={handleSignUpClick}>
          Don't have an account? Sign Up
        </button>
      </p>
      </div>
    );
  }
};

export default Login;

// import { useState } from "react";

// const Login = () => {
//   const [studentNumber, setStudentNumber] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // Validate the student number and password here
//     if (studentNumber === "123456" && password === "password") {
//       // Redirect to the main page after successful login
//       history.push("/home");
//     } else {
//       // Handle login failure (e.g., show error message)
//       console.log("Invalid credentials");
//     }
//   };

//   return (
//     <div className="login-container">
//       <h1>Login</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Student Number:
//           <input
//             type="text"
//             value={studentNumber}
//             onChange={(event) => setStudentNumber(event.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           Password: 
//           <input
//             type="password"
//             value={password}
//             onChange={(event) => setPassword(event.target.value)}
//           />
//         </label>
//         <br />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;