import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../API/axios";

import Left_ad from "../side-ad/Left_ad";
import Right_ad from "../side-ad/Right_ad";
import Bottom_ad from "../side-ad/Bottom_ad";
import Navbar from "../Navbar/Navbar";
import Timer from "../Timer/Timer";

import "../side-ad/ad_page.css";

const LinkAd = () => {

  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");

  const [seconds, setSeconds] = useState(10);

  const [originalUrl, setOriginalUrl] = useState("");

  const [loading, setLoading] = useState(true);

  /* =============================
          CHECK LINK
  ============================== */

  useEffect(() => {

    if (!code) {

      window.location.href = "/";

    }

  }, [code]);

  /* =============================
      GET ORIGINAL URL
  ============================== */

  useEffect(() => {

    if (!code) return;

    const fetchOriginalUrl = async () => {

      try {

        const res = await api.get(`/shortener/${code}`);

        setOriginalUrl(res.data.original_url);

      } catch (err) {

        console.error(err);

        alert("Invalid or expired link.");

        window.location.href = "/";

      } finally {

        setLoading(false);

      }

    };

    fetchOriginalUrl();

  }, [code]);

  /* =============================
          COUNTDOWN
  ============================== */

  useEffect(() => {

    if (loading) return;

    if (seconds === 0) return;

    const interval = setInterval(() => {

      setSeconds(prev => prev - 1);

    }, 1000);

    return () => clearInterval(interval);

  }, [seconds, loading]);

  /* =============================
      REDIRECT
  ============================== */

  useEffect(() => {

    if (loading) return;

    if (seconds !== 0) return;

    if (!originalUrl) return;

    const finish = async () => {

      try {

        await api.post(`/shortener/click/${code}`);

      } catch (err) {

        console.error(err);

      }

      window.location.href = originalUrl;

    };

    finish();

  }, [seconds, originalUrl, loading, code]);

  return (
    <>
      <Navbar />

      <div className="ad-page">

        <Left_ad />

        <div className="ad-center-box">

          <div className="ad-timer-inside">

            <Timer seconds={seconds} />

          </div>

          <h1>Advertisement</h1>

          <p className="highlight">
            Watch advertisement for 10 seconds
          </p>

          <p>⏳ Please wait...</p>

        </div>

        <Right_ad />

      </div>

      <Bottom_ad />

    </>
  );

};

export default LinkAd;