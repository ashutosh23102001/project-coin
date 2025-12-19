// import React, { useState } from "react";
// import "./Register.css";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../../API/axios"; // ✅ FIXED
// const Register = () => {

// const [email, setEmail] = useState("")
// const [Username, setUsername] = useState("")
// const [password, setPassword] = useState("")
//   const [error, setError] = useState("");

// //onclick let us get what user has enter
//     const createUser = () => {
          

//     // we shall require axios to create API that connect to the server
// //lets install axios 'npm install axios'
//         Axios.post('http://localhost:3002/register',{
//             //create a variable to hold the data
//             Email: email,
//             Username: Username,            
//             Password: password
//         }).then(()=>{
//             console.log("User registered successfully")
//         }).catch((err)=>{
//             console.log(err);
//         });

//     }


//   return (
//       <div className="popup-overlay">
//       <div className="popup-container">
       

//         <div className="left-side">
//           <h2>Create new account</h2>
//           <form>
//             <div className="input-group">
//               <i className="icon user-icon" />
//               <input type="text" placeholder="Username" onChange={(event)=>{setUsername(event.target.value)
//               }} />
//             </div>
//             <div className="input-group">
//               <i className="icon email-icon" />
//               <input type="email" placeholder="Email" onChange={(event)=>{setEmail(event.target.value)
//               }} />
//             </div>
//             <div className="input-group">
//               <i className="icon lock-icon" />
//               <input type="password" placeholder="Password" onChange={(event)=>{setPassword(event.target.value)
//               }} />
//             </div>

//             <div className="terms-checkbox">
//               <input type="checkbox" id="terms" />
//               <label htmlFor="terms">I read and agree to Terms & Conditions</label>
//             </div>
//             <button type="submit" className="create-account-btn" onClick={(event)=>{event.preventDefault(); // ⭐ STOP FORM SUBMISSION
//     createUser();}}>
//               CREATE ACCOUNT
//             </button>
//           </form>
//         </div>

//         <div className="right-side">
//         <Link to="/">
//         <button className="popup-close-btn">&times;</button>
//          </Link>
//           <h1>Hello World!</h1>
//           <p>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//             eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
//             ad minim veniam.
//           </p>
//           <button className="learn-more-btn">Learn More</button>
//           <Link to="/login">
//           <button className="login-page-btn" >
//             Login Page
//           </button>
//           </Link>
//         </div>
//       </div>
//     </div>

    
//   )
// }

// export default Register

// import React, { useState } from "react";
// import "./Register.css";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../../API/axios"; // ✅ FIXED

// const Register = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const createUser = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await api.post("/register", {
//         Email: email,
//         Username: username,
//         Password: password
//       });

//       alert("✅ Registered successfully");
//       navigate("/login");
//     } catch (err) {
//       if (err.response?.status === 409) {
//         setError("Username already exists");
//       } else {
//         setError("Registration failed");
//       }
//     }
//   };

//   return (
//     <div className="popup-overlay">
//       <div className="popup-container">
//         <div className="left-side">
//           <h2>Create new account</h2>

//           {error && <p style={{ color: "red" }}>{error}</p>}

//           <form onSubmit={createUser}>
//             <div className="input-group">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 required
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>

//             <div className="input-group">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 required
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="input-group">
//               <input
//                 type="password"
//                 placeholder="Password"
//                 required
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <button type="submit" className="create-account-btn">
//               CREATE ACCOUNT
//             </button>
//           </form>
//         </div>

//         <div className="right-side">
//           <Link to="/">
//             <button className="popup-close-btn">&times;</button>
//           </Link>

//           <h1>Hello World!</h1>
//           <p>Lorem ipsum dolor sit amet.</p>

//           <Link to="/login">
//             <button className="login-page-btn">Login Page</button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../API/axios"; // ✅ USE SHARED AXIOS INSTANCE

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ CREATE USER
  const createUser = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/register", {
        Email: email,
        Username: Username,
        Password: password
      });

      alert("✅ User registered successfully");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Username already exists");
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        <div className="left-side">
          <h2>Create new account</h2>

          {/* 🔴 ERROR MESSAGE */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={createUser}>
            <div className="input-group">
              <i className="icon user-icon" />
              <input
                type="text"
                placeholder="Username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <i className="icon email-icon" />
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <i className="icon lock-icon" />
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="terms-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I read and agree to Terms & Conditions
              </label>
            </div>

            <button type="submit" className="create-account-btn">
              CREATE ACCOUNT
            </button>
          </form>
        </div>

        <div className="right-side">
          <Link to="/">
            <button className="popup-close-btn">&times;</button>
          </Link>

          <h1>Hello World!</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <button className="learn-more-btn">Learn More</button>

          <Link to="/login">
            <button className="login-page-btn">
              Login Page
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
