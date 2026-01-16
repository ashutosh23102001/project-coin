
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

// import api from "../../API/axios";
// import { useAuth } from "../../context/AuthContext";

// import "./coin.css";

// /* ================================
//    SAVE CLICK DATA (SESSION USER)
// ================================ */
// const saveClickData = async (clicks) => {
//   try {
//     await api.post("/saveClickData", {
//       clicks_added: clicks
//     });
//   } catch (err) {
//     console.error("Save click error:", err);
//   }
// };

// const Coin = () => {
//   const navigate = useNavigate();
//   const { user, loading } = useAuth();

//   const MAX_CLICKS = 10;
//   const RESET_TIME = 60;

//   const [count, setCount] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [isLocked, setIsLocked] = useState(false);
//   const [totalClicks, setTotalClicks] = useState(0);

//   /* ================================
//      REDIRECT IF NOT AUTHENTICATED
//   ================================ */
//   useEffect(() => {
//     if (!loading && !user) {
//       navigate("/login");
//     }
//   }, [loading, user, navigate]);

//   /* ================================
//      TIMER LOCK LOGIC
//   ================================ */
//   useEffect(() => {
//     if (!isLocked) return;

//     setTimeLeft(RESET_TIME);

//     const countdown = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(countdown);
//           setIsLocked(false);
//           setCount(0);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(countdown);
//   }, [isLocked]);

//   /* ================================
//      CLICK HANDLER
//   ================================ */
//   const handleClick = () => {
//     if (loading || !user || isLocked) return;

//     const newCount = count + 1;
//     setCount(newCount);
//     setTotalClicks((prev) => prev + 1);

//     if (newCount >= MAX_CLICKS) {
//       setIsLocked(true);
//       saveClickData(MAX_CLICKS);
//     }
//   };

//   /* ================================
//      LOADING SCREEN
//   ================================ */
//   if (loading) {
//     return (
//       <div style={{ color: "#fff", textAlign: "center", marginTop: "100px" }}>
//         Checking authentication...
//       </div>
//     );
//   }

//   if (!user) return null;

//   /* ================================
//      UI
//   ================================ */
//   return (
//     <>
//       <Left_ad />
//       <Navbar />
//       <Right_ad />

//       <div className="coin-page">
//         <div className="card">
//           <button
//             className="btn"
//             onClick={handleClick}
//             disabled={isLocked}
//           >
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

import { useAuth } from "../../context/AuthContext";
import "./coin.css";

const MAX_CLICKS = 10;
const RESET_TIME = 60;

const Coin = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [totalClicks, setTotalClicks] = useState(0);

  /* 🔐 AUTH CHECK */
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  /* ⏳ TIMER UNLOCK */
  useEffect(() => {
    if (!isLocked) return;

    setTimeLeft(RESET_TIME);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLocked(false);
          setCount(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked]);

  /* 🖱 CLICK */
  const handleClick = () => {
    if (loading || !user || isLocked) return;

    const newCount = count + 1;
    setCount(newCount);
    setTotalClicks((prev) => prev + 1);

    if (newCount >= MAX_CLICKS) {
      setIsLocked(true);
      navigate("/ad"); // ✅ GO TO AD
    }
  };

  if (loading) return <div style={{ color: "#fff" }}>Loading...</div>;
  if (!user) return null;

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

          <TotalCount total={totalClicks} />
          <ProgressBar count={count} />
          <TaskBar />
        </div>
      </div>

      <Bottom_ad />
    </>
  );
};

export default Coin;
