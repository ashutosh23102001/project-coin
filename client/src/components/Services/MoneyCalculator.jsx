import { useMemo, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Left_ad from "../side-ad/Left_ad";
import Right_ad from "../side-ad/Right_ad";
import Bottom_ad from "../side-ad/Bottom_ad";
import "./MoneyCalculator.css";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const MoneyCalculator = () => {
  const [totalCash, setTotalCash] = useState("");
  const [qty, setQty] = useState({
    500: "", 200: "", 100: "", 50: "", 20: "", 10: "", 5: "", 2: "", 1: "",
  });

  const handleTotalCash = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setTotalCash(value);
  };

  const handleQty = (note, value) => {
    const number = value.replace(/\D/g, "");
    setQty((prev) => ({ ...prev, [note]: number }));
  };

  const summary = useMemo(() => {
    let countedCash = 0;
    let totalNotes = 0;
    let totalCoins = 0;

    DENOMINATIONS.forEach((note) => {
      const count = Number(qty[note] || 0);
      countedCash += note * count;
      if (note >= 5) {
        totalNotes += count;
      } else {
        totalCoins += count;
      }
    });

    const expectedCash = Number(totalCash || 0);
    const difference = countedCash - expectedCash;

    return { countedCash, totalNotes, totalCoins, difference };
  }, [qty, totalCash]);

  const format = (value) => Number(value || 0).toLocaleString("en-IN");

  const resetCalculator = () => {
    setTotalCash("");
    setQty({ 500: "", 200: "", 100: "", 50: "", 20: "", 10: "", 5: "", 2: "", 1: "" });
  };

  return (
    <>
      <Navbar />

      <div className="money-page">
        <Left_ad />

        <div className="money-container">
          <div className="money-card">
            {/* Header */}
            <div className="card-header">
              <h1>💰 MONEY CALCULATOR</h1>
            </div>

            {/* Split Layout: Left Table + Right Summary */}
            <div className="calculator-body">
              {/* Left Panel */}
              <div className="left-panel">
                <h2 className="panel-title">Denomination Calculator</h2>

                <table className="money-table">
                  <thead>
                    <tr>
                      <th>Denomination</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DENOMINATIONS.map((note) => {
                      const count = Number(qty[note] || 0);
                      const amount = note * count;

                      return (
                        <tr key={note}>
                          <td className="denomination">₹{note}</td>
                          <td>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={qty[note]}
                              className="qty-input"
                              placeholder="0"
                              onChange={(e) => handleQty(note, e.target.value)}
                            />
                          </td>
                          <td className="amount">₹ {format(amount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Right Panel */}
              <div className="right-panel">
                <div className="summary-section">
                  <label className="section-label">Total Cash</label>
                  <div className="value-box input-box">
                    <span>₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={totalCash}
                      placeholder="0"
                      onChange={handleTotalCash}
                    />
                  </div>
                </div>

                <div className="summary-section">
                  <label className="section-label">Difference</label>
                  <div
                    className={`value-box display-box ${
                      summary.difference === 0
                        ? "equal"
                        : summary.difference < 0
                        ? "less"
                        : "greater"
                    }`}
                  >
                    ₹ {format(summary.difference)}
                  </div>
                </div>

                <hr className="divider" />

                <div className="breakdown-section">
                  <div className="summary-row">
                    <span>Counted Cash</span>
                    <strong>₹ {format(summary.countedCash)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Total Notes</span>
                    <strong>{summary.totalNotes}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Total Coins</span>
                    <strong>{summary.totalCoins}</strong>
                  </div>
                </div>

                <button className="reset-btn" onClick={resetCalculator}>
                  [ Reset Calculator ]
                </button>
              </div>
            </div>
          </div>
        </div>

        <Right_ad />
      </div>

      <Bottom_ad />
    </>
  );
};

export default MoneyCalculator;