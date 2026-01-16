import React, { useEffect, useState } from "react";
import api from "../../../../API/axios";
import "./Points.css";

/* =========================================
   💰 POINTS / EARNINGS COMPONENT
========================================= */
const Points = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/points")
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch points", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading points...</p>;
  if (!data) return <p>No data</p>;

  return (
    <div className="points-wrapper">
      <h2>💰 My Earnings</h2>

      <table className="points-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Clicks</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Coin Game</td>
            <td>{data.coinClicks}</td>
          </tr>

          <tr>
            <td>Link Shortener</td>
            <td>{data.linkClicks}</td>
          </tr>

          <tr className="total-row">
            <td>Total</td>
            <td>{data.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Points;
