import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdPage = () => {
  const { code } = useParams();
  const [time, setTime] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t - 1);
    }, 1000);

    if (time === 0) {
      window.location.href = `http://localhost:3002/api/go/${code}`;
    }

    return () => clearInterval(interval);
  }, [time, code]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Advertisement</h2>
      <div style={{ height: 200, background: "#ddd" }}>AD HERE</div>
      <p>Redirecting in {time} seconds...</p>
    </div>
  );
};

export default AdPage;
