// import { useState, useEffect } from 'react';
// import ProgressBar from '../Timer/ProgressBar';
// import TotalCount from '../Timer/TotalCount';
// import Timer from '../Timer/Timer';
// import TaskBar from '../taskbar/TaskBar';
// import Right_ad from '../side-ad/Right_ad';
// import Left_ad from '../side-ad/Left_ad';
// import Bottom_ad from '../side-ad/Bottom_ad';
// import Navbar from '../Navbar/Navbar'
// import axios from 'axios';


// import './coin.css';

// const saveClickData = async (username, clicks) => {
//     try {
//         const response = await axios.post('http://localhost:3002/saveClickData', {
//             username: username, // Replace with actual user context (e.g., from global state/Auth)
//             clicks_added: clicks,
//         });
//         console.log('Server response:', response.data.message);
//     } catch (error) {
//         console.error('Error saving click data:', error.response ? error.response.data : error.message);
//     }
// };
// const Coin = () => {
//   const MAX_CLICKS = 10;
//   const RESET_TIME = 1 * 60; // 60 seconds

//   const [count, setCount] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [isLocked, setIsLocked] = useState(false);
//   const [totalClicks, setTotalClicks] = useState(0);
//   const USERNAME = "test_user_123";

//   useEffect(() => {
//     let countdown;
//     if (isLocked) {
//       setTimeLeft(RESET_TIME);
//       countdown = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1) {
//             setIsLocked(false);
//             setCount(0);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(countdown);
//   }, [isLocked]);

//   const handleClick = () => {
//     if (!isLocked && count < MAX_CLICKS) {
//       const newCount = count + 1;
//       setCount(newCount);

//       setTotalClicks((prev) => prev + 1);
//       if (newCount >= MAX_CLICKS) setIsLocked(true);
//     }
//   };

//   return (
//     <>        
//         <Left_ad/>
//         <Navbar/>
//         <Right_ad />
//         <div className="coin-page">
//             <div className="card">
//                 <button className="btn" onClick={handleClick} disabled={isLocked}>
//                     {isLocked ? <Timer seconds={timeLeft} /> : `Count is ${count}`}
//                 </button>
//                 <div className='clicks'>
//                     <TotalCount total={totalClicks} />
//                 </div>
//                 <ProgressBar count={count} />
//                 <TaskBar />
//             </div>
//         </div>
        
        
//         <Bottom_ad/>
//     </>
//   );
// }

// export default Coin;


// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import ProgressBar from "../Timer/ProgressBar";
// import TotalCount from "../Timer/TotalCount";
// import Timer from "../Timer/Timer";
// import TaskBar from "../taskbar/TaskBar";
// import Right_ad from "../side-ad/Right_ad";
// import Left_ad from "../side-ad/Left_ad";
// import Bottom_ad from "../side-ad/Bottom_ad";
// import Navbar from "../Navbar/Navbar";

// import api from "../../API/axios"; // ✅ correct axios instance
// import "./coin.css";

// // --------------------------------------------------
// // SAVE CLICK DATA (USES LOGGED-IN USER)
// // --------------------------------------------------
// const saveClickData = async (username, clicks) => {
//   try {
//     const res = await api.post("/saveClickData", {
//       username,
//       clicks_added: clicks,
//     });
//     console.log(res.data.message);
//   } catch (err) {
//     console.error("Save click error:", err);
//   }
// };
// // --------------------------------------------------

// const Coin = () => {
//   const navigate = useNavigate();

//   const MAX_CLICKS = 10;
//   const RESET_TIME = 60;

//   const [count, setCount] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [isLocked, setIsLocked] = useState(false);
//   const [totalClicks, setTotalClicks] = useState(0);

//   const [user, setUser] = useState(null); // ✅ logged-in user

//   // --------------------------------------------------
//   // 🔐 AUTH CHECK (PROTECTED ROUTE)
//   // --------------------------------------------------
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await api.get("/auth/me"); // session check
//         if (res.data.loggedIn) {
//           setUser(res.data.user);
//         } else {
//           navigate("/login");
//         }
//       } catch (err) {
//         navigate("/login");
//       }
//     };
//     checkAuth();
//   }, [navigate]);

//   // --------------------------------------------------
//   // TIMER LOCK LOGIC
//   // --------------------------------------------------
//   useEffect(() => {
//     let countdown;
//     if (isLocked) {
//       setTimeLeft(RESET_TIME);
//       countdown = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1) {
//             setIsLocked(false);
//             setCount(0);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(countdown);
//   }, [isLocked]);

//   // --------------------------------------------------
//   // CLICK HANDLER
//   // --------------------------------------------------
//   const handleClick = () => {
//     if (!isLocked && count < MAX_CLICKS && user) {
//       const newCount = count + 1;
//       setCount(newCount);
//       setTotalClicks((prev) => prev + 1);

//       if (newCount >= MAX_CLICKS) {
//         setIsLocked(true);
//         saveClickData(user.username, MAX_CLICKS); // ✅ real user
//       }
//     }
//   };

//   // --------------------------------------------------
//   // OPTIONAL LOADING STATE
//   // --------------------------------------------------
//   if (!user) {
//     return <div style={{ color: "#fff", textAlign: "center" }}>Loading...</div>;
//   }

//   return (
//     <>
//       <Left_ad />
//       <Navbar />
//       <Right_ad />

//       <div className="coin-page">
//         <div className="card">
//           <button className="btn" onClick={handleClick} disabled={isLocked}>
//             {isLocked ? <Timer seconds={timeLeft} /> : `Count is ${count}`}
//           </button>

//           <div className="clicks">
//             <TotalCount total={totalClicks} />
//           </div>

//           <ProgressBar count={count} />
//           <TaskBar />
//         </div>
//       </div>

//       <Bottom_ad />
//     </>
//   );
// };

// export default Coin;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ProgressBar from "../Timer/ProgressBar";
import TotalCount from "../Timer/TotalCount";
import Timer from "../Timer/Timer";
import TaskBar from "../taskbar/TaskBar";
import Right_ad from "../side-ad/Right_ad";
import Left_ad from "../side-ad/Left_ad";
import Bottom_ad from "../side-ad/Bottom_ad";
import Navbar from "../Navbar/Navbar";

import api from "../../API/axios"; // ✅ shared axios instance
import "./coin.css";

// --------------------------------------------------
// SAVE CLICK DATA (SESSION-BASED)
// --------------------------------------------------
const saveClickData = async (clicks) => {
  try {
    const res = await api.post("/saveClickData", {
      clicks_added: clicks
    });
    console.log(res.data.message);
  } catch (err) {
    console.error("Save click error:", err);
  }
};
// --------------------------------------------------

const Coin = () => {
  const navigate = useNavigate();

  const MAX_CLICKS = 10;
  const RESET_TIME = 60;

  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [totalClicks, setTotalClicks] = useState(0);

  const [user, setUser] = useState(null);

  // --------------------------------------------------
  // 🔐 AUTH CHECK (PROTECTED ROUTE)
  // --------------------------------------------------
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.loggedIn) {
          setUser(res.data.user);
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  // --------------------------------------------------
  // TIMER LOCK LOGIC
  // --------------------------------------------------
  useEffect(() => {
    let countdown;
    if (isLocked) {
      setTimeLeft(RESET_TIME);
      countdown = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setCount(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [isLocked]);

  // --------------------------------------------------
  // CLICK HANDLER
  // --------------------------------------------------
  const handleClick = () => {
    if (!isLocked && count < MAX_CLICKS && user) {
      const newCount = count + 1;
      setCount(newCount);
      setTotalClicks((prev) => prev + 1);

      if (newCount >= MAX_CLICKS) {
        setIsLocked(true);
        saveClickData(MAX_CLICKS); // ✅ save after lock
      }
    }
  };

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------
  if (!user) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "100px" }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Left_ad />
      <Navbar />
      <Right_ad />

      <div className="coin-page">
        <div className="card">
          <button className="btn" onClick={handleClick} disabled={isLocked}>
            {isLocked ? <Timer seconds={timeLeft} /> : `Count is ${count}`}
          </button>

          <div className="clicks">
            <TotalCount total={totalClicks} />
          </div>

          <ProgressBar count={count} />
          <TaskBar />
        </div>
      </div>

      <Bottom_ad />
    </>
  );
};

export default Coin;
