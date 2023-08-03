import { useEffect, useState } from "react";
import { useNavigate } from "react-router"
import axios from "axios";

const Login = () => {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

  let navigate = useNavigate();

  useEffect(() => {
      if (isLoggedIn) {
        navigate('/home')
      }
    })
    
    try {
      const response = axios.post("/api/auth/login", {
        studentNumber,
        password,
      });

      // Assuming the server responds with a success message
      if (response.data.success) {
        setIsLoggedIn(true);
        setAuthState({ username: response.data.username, id: response.data.id, status: true});
        navigate("/home");
      } else {
        // Handle login failure (e.g., show error message)
        console.log("Invalid credentials");
      }
    } catch (error) {
      console.log("Error occurred during login:", error);
    }
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
            <button type="submit">Don't have an account? Sign Up</button>
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