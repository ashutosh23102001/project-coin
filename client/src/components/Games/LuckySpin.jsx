
// import { useState } from "react";
// import api from "../../API/axios";

// import Navbar from "../Navbar/Navbar";
// import Left_ad from "../side-ad/Left_ad";
// import Right_ad from "../side-ad/Right_ad";
// import Bottom_ad from "../side-ad/Bottom_ad";

// import RewardButtons from "./RewardButtons";
// import Pointer from "./Pointer";
// import SpinWheel from "./SpinWheel";

// import "./LuckySpin.css";

// const LuckySpin = () => {
//   const [selectedReward, setSelectedReward] = useState(null);

//   const [rotation, setRotation] = useState(0);

//   const [isSpinning, setIsSpinning] = useState(false);

//   const [result, setResult] = useState("");

//   const [reward, setReward] = useState(0);

//   const spinWheel = async () => {
//     if (isSpinning) return;

//     if (!selectedReward) {
//       alert("Please select reward first.");

//       return;
//     }

//     setIsSpinning(true);

//     setResult("");

//     try {
//       /*
//                 Backend Response Example

//                 {
//                     won:true,
//                     reward:30,
//                     rotation:2340
//                 }
//             */

//       const res = await api.post("/lucky-spin", {
//         reward: selectedReward,
//       });

//       setRotation(res.data.rotation);

//       setTimeout(() => {
//         setReward(res.data.reward);

//         if (res.data.won) {
//           setResult(`🎉 Congratulations! You won ${res.data.reward} Points`);
//         } else {
//           setResult("😔 Better Luck Next Time");
//         }

//         setIsSpinning(false);
//       }, 5000);
//     } catch (err) {
//       console.log(err);

//       setIsSpinning(false);
//     }
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

//             <p className="spin-subtitle">Select your expected reward.</p>

//             <RewardButtons
//               selectedReward={selectedReward}
//               setSelectedReward={setSelectedReward}
//             />

//             <Pointer />

//             <SpinWheel
//     rotation={rotation}
//     onSpin={spinWheel}
//     isSpinning={isSpinning}
// />
//             <button
//               className="spin-btn"
//               onClick={spinWheel}
//               disabled={isSpinning}
//             >
//               {isSpinning ? "🎡 Spinning..." : "🎯 Spin Now"}
//             </button>

//             {reward > 0 && (
//               <div className="reward-box">
//                 <h3>Selected Reward</h3>

//                 <span>{reward} Points</span>
//               </div>
//             )}

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

            alert("Please select a reward first.");

            return;

        }

        setIsSpinning(true);

        setResult("");

        try {

            const res = await api.post("/lucky-spin", {

                selectedReward

            });

            setRotation(res.data.rotation);

            setTimeout(() => {

                setReward(res.data.reward);

                if (res.data.won) {

                    setResult(
                        `🎉 Congratulations! You won ${res.data.reward} Points`
                    );

                } else {

                    setResult(
                        "😔 Better Luck Next Time"
                    );

                }

                setIsSpinning(false);

            }, 5000);

        }

        catch (err) {

            console.error(err);

            setResult("Something went wrong.");

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

                        <h1 className="spin-title">

                            🎡 Lucky Spin

                        </h1>

                        <p className="spin-subtitle">

                            Choose your expected reward and spin the wheel.

                        </p>

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

                        {reward > 0 && (

                            <div className="reward-box">

                                <h3>

                                    Selected Reward

                                </h3>

                                <span>

                                    {reward} Points

                                </span>

                            </div>

                        )}

                        {result && (

                            <div className="result-box">

                                {result}

                            </div>

                        )}
                                            </div>

                    <Bottom_ad />

                </div>

            </div>

        </>

    );

};

export default LuckySpin;