import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../API/axios";

import Left_ad from "../side-ad/Left_ad";
import Right_ad from "../side-ad/Right_ad";
import Bottom_ad from "../side-ad/Bottom_ad";
import Navbar from "../Navbar/Navbar";

import "./ad_page.css";

const Ad = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(async () => {
      await api.post("/saveClickData", { clicks_added: 10 });
      navigate("/coin");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Navbar />

      <div className="ad-page">
        <Left_ad />

        <div className="ad-center-box">
          <h1>Advertisement</h1>
          <p className="highlight">Watch ad for 10 seconds</p>
          <p>⏳ Please wait...</p>
        </div>

        <Right_ad />
      </div>

      <Bottom_ad />
    </>
  );
};

export default Ad;
