// import { useState } from "react";

// import Navbar from "../Navbar/Navbar";
// import Left_ad from "../side-ad/Left_ad";
// import Right_ad from "../side-ad/Right_ad";
// import Bottom_ad from "../side-ad/Bottom_ad";

// import "./LuckySpin.css";

// const LuckySpin = () => {
//   const [selectedReward, setSelectedReward] = useState(null);

//   const [isSpinning, setIsSpinning] = useState(false);

//   const [rotation, setRotation] = useState(0);

//   const [result, setResult] = useState("");

//   const rewards = [
//     "10",
//     "Better Luck",
//     "30",
//     "Better Luck",
//     "10",
//     "Better Luck",
//     "10",
//     "Better Luck",
//   ];

//   const handleSpin = () => {
//     if (isSpinning) return;

//     if (!selectedReward) {
//       alert("Please select your expected reward.");

//       return;
//     }

//     setIsSpinning(true);

//     setResult("");

//     const randomRotation = 360 * 6 + Math.floor(Math.random() * 360);

//     setRotation(randomRotation);

//     setTimeout(() => {
//       setIsSpinning(false);

//       setResult("Waiting for backend...");
//     }, 5000);
//   };

//   return (
//     <>
//       <Navbar />

//       <Left_ad />

//       <Right_ad />

//       <div className="coin-page">
//         <div className="spin-container">
//           <div className="spin-card">
//             <h1 className="spin-title">🎡 Lucky Spin</h1>

//             <p className="spin-subtitle">
//               Select your expected reward and spin the wheel.
//             </p>

//             {/* Reward Buttons */}

//             <div className="reward-buttons">
//               <button
//                 className={selectedReward === 10 ? "active" : ""}
//                 onClick={() => setSelectedReward(10)}
//               >
//                 10 Points
//               </button>

//               <button
//                 className={selectedReward === 30 ? "active" : ""}
//                 onClick={() => setSelectedReward(30)}
//               >
//                 30 Points
//               </button>
//             </div>

//             {/* Pointer */}

//             <div className="pointer">▼</div>

//             {/* Wheel Starts Below */}
//            {/* ================= WHEEL ================= */}

// <div className="wheel-wrapper">

//     <svg
//         className="wheel"
//         viewBox="0 0 500 500"
//         style={{
//             transform: `rotate(${rotation}deg)`
//         }}
//     >

//         <circle
//             cx="250"
//             cy="250"
//             r="245"
//             fill="#202020"
//             stroke="#555"
//             strokeWidth="8"
//         />

//         {/* Slice 1 */}

//         <path
//             d="M250 250 L250 5 A245 245 0 0 1 423 76 Z"
//             fill="#00BCD4"
//         />

//         {/* Slice 2 */}

//         <path
//             d="M250 250 L423 76 A245 245 0 0 1 495 250 Z"
//             fill="#E53935"
//         />

//         {/* Slice 3 */}

//         <path
//             d="M250 250 L495 250 A245 245 0 0 1 423 423 Z"
//             fill="#00BCD4"
//         />

//         {/* Slice 4 */}

//         <path
//             d="M250 250 L423 423 A245 245 0 0 1 250 495 Z"
//             fill="#E53935"
//         />

//         {/* Slice 5 */}

//         <path
//             d="M250 250 L250 495 A245 245 0 0 1 76 423 Z"
//             fill="#00BCD4"
//         />

//         {/* Slice 6 */}

//         <path
//             d="M250 250 L76 423 A245 245 0 0 1 5 250 Z"
//             fill="#E53935"
//         />

//         {/* Slice 7 */}

//         <path
//             d="M250 250 L5 250 A245 245 0 0 1 76 76 Z"
//             fill="#00BCD4"
//         />

//         {/* Slice 8 */}

//         <path
//             d="M250 250 L76 76 A245 245 0 0 1 250 5 Z"
//             fill="#E53935"
//         />

//         {/* Center */}

//         <circle
//             cx="250"
//             cy="250"
//             r="45"
//             fill="#111"
//             stroke="#00BCD4"
//             strokeWidth="5"
//         />

//     </svg>

// </div>

//             {/* Spin Button */}

//             <button
//               className="spin-btn"
//               onClick={handleSpin}
//               disabled={isSpinning}
//             >
//               {isSpinning ? "Spinning..." : "🎡 Spin Now"}
//             </button>

//             {/* Selected Reward */}

//             {selectedReward && (
//               <div className="selected-box">
//                 Expected Reward :<strong>{selectedReward} Points</strong>
//               </div>
//             )}

//             {/* Result */}

//             {result && <div className="result-box">{result}</div>}
//           </div>

//           <Bottom_ad />
//         </div>
//       </div>
//     </>
//   );
// };

// export default LuckySpin;

import { useState } from "react";
import api from "../../API/axios";

import Navbar from "../Navbar/Navbar";
import Left_ad from "../side-ad/Left_ad";
import Right_ad from "../side-ad/Right_ad";
import Bottom_ad from "../side-ad/Bottom_ad";

import RewardButtons from "./RewardButtons";
import Pointer from "./Pointer";
import SpinWheel from "./SpinWheel";

import "./LuckySpin.css";

const LuckySpin = () => {
  const [selectedReward, setSelectedReward] = useState(null);

  const [rotation, setRotation] = useState(0);

  const [isSpinning, setIsSpinning] = useState(false);

  const [result, setResult] = useState("");

  const [reward, setReward] = useState(0);

  const spinWheel = async () => {
    if (isSpinning) return;

    if (!selectedReward) {
      alert("Please select reward first.");

      return;
    }

    setIsSpinning(true);

    setResult("");

    try {
      /*
                Backend Response Example

                {
                    won:true,
                    reward:30,
                    rotation:2340
                }
            */

      const res = await api.post("/lucky-spin", {
        reward: selectedReward,
      });

      setRotation(res.data.rotation);

      setTimeout(() => {
        setReward(res.data.reward);

        if (res.data.won) {
          setResult(`🎉 Congratulations! You won ${res.data.reward} Points`);
        } else {
          setResult("😔 Better Luck Next Time");
        }

        setIsSpinning(false);
      }, 5000);
    } catch (err) {
      console.log(err);

      setIsSpinning(false);
    }
  };

  return (
    <>
      <Navbar />

      <Left_ad />

      <Right_ad />

      <div className="coin-page">
        <div className="spin-container">
          <div className="spin-card">
            <h1 className="spin-title">🎡 Lucky Spin</h1>

            <p className="spin-subtitle">Select your expected reward.</p>

            <RewardButtons
              selectedReward={selectedReward}
              setSelectedReward={setSelectedReward}
            />

            <Pointer />

            <SpinWheel
    rotation={rotation}
    onSpin={spinWheel}
    isSpinning={isSpinning}
/>
            <button
              className="spin-btn"
              onClick={spinWheel}
              disabled={isSpinning}
            >
              {isSpinning ? "🎡 Spinning..." : "🎯 Spin Now"}
            </button>

            {reward > 0 && (
              <div className="reward-box">
                <h3>Selected Reward</h3>

                <span>{reward} Points</span>
              </div>
            )}

            {result && <div className="result-box">{result}</div>}
          </div>

          <Bottom_ad />
        </div>
      </div>
    </>
  );
};

export default LuckySpin;
