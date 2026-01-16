
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../API/axios";

import ProgressBar from "../Timer/ProgressBar";
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

  /* 🔐 AUTH */
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  /* 📥 FETCH TOTAL CLICKS */
  useEffect(() => {
    if (!user) return;

    api.get("/points", { withCredentials: true })
      .then(res => {
        setTotalClicks(res.data.total || 0);
      })
      .catch(err => {
        console.error("Failed to fetch points", err);
      });
  }, [user]);

  /* ⏳ LOCK TIMER */
  useEffect(() => {
    if (!isLocked) return;

    setTimeLeft(RESET_TIME);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
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

    if (newCount >= MAX_CLICKS) {
      setIsLocked(true);
      navigate("/ad");
    }
  };

  if (loading) return <div style={{ color: "#fff" }}>Loading...</div>;
  if (!user) return null;

  return (
    <>
      <Navbar />
      <Left_ad />
      <Right_ad />

      <div className="coin-page">
        <div className="card">

          <button className="btn" onClick={handleClick} disabled={isLocked}>
            {isLocked ? <Timer seconds={timeLeft} /> : `Count is ${count}`}
          </button>

          {/* 👇 COUNTS ROW (SAME LINE) */}
          <div className="count-row">
            <span>{count}/{MAX_CLICKS}</span>
            <span>Total Clicks: {totalClicks}</span>
          </div>

          <ProgressBar count={count}  />
          <TaskBar />
        </div>
      </div>

      <Bottom_ad />
    </>
  );
};

export default Coin;
