

// import "./SpinWheel.css";

// const sections = [
//   {
//     id: 1,
//     label: "10",
//     color: "#2ECC71",
//   },
//   {
//     id: 2,
//     label: "Better Luck",
//     color: "#E74C3C",
//   },
//   {
//     id: 3,
//     label: "30",
//     color: "#F1C40F",
//   },
//   {
//     id: 4,
//     label: "Better Luck",
//     color: "#3498DB",
//   },
//   {
//     id: 5,
//     label: "10",
//     color: "#9B59B6",
//   },
//   {
//     id: 6,
//     label: "Better Luck",
//     color: "#1ABC9C",
//   },
//   {
//     id: 7,
//     label: "10",
//     color: "#FF9800",
//   },
//   {
//     id: 8,
//     label: "Better Luck",
//     color: "#607D8B",
//   },
// ];

// const SpinWheel = ({
//   rotation,
//   onSpin,
//   isSpinning,
// }) => {
//   return (
//     <div className="wheel-container">

//       <div
//         className="wheel"
//         style={{
//           transform: `rotate(${rotation}deg)`,
//         }}
//       >

//         {sections.map((item, index) => (

//           <div
//             key={item.id}
//             className="slice"
//             style={{
//               transform: `rotate(${index * 45}deg) skewY(-45deg)`,
//               background: item.color,
//             }}
//           >

//             <span
//               className="slice-text"
//               style={{
//                 transform: "skewY(45deg) rotate(22.5deg)",
//               }}
//             >
//               {item.label}
//             </span>

//           </div>

//         ))}

//         <div
//           className={`wheel-center ${isSpinning ? "disabled" : ""}`}
//           onClick={!isSpinning ? onSpin : undefined}
//         >

//           {isSpinning ? "..." : "START"}

//         </div>

//       </div>

//     </div>
//   );
// };

// export default SpinWheel;

import "./SpinWheel.css";

const sections = [
  { text: "10", color: "#2ECC71" },
  { text: "Better Luck", color: "#E74C3C" },
  { text: "30", color: "#F1C40F" },
  { text: "Better Luck", color: "#3498DB" },
  { text: "10", color: "#9B59B6" },
  { text: "Better Luck", color: "#1ABC9C" },
  { text: "10", color: "#FF9800" },
  { text: "Better Luck", color: "#607D8B" },
];

const radius = 220;
const center = 250;

function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;

  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSlice(startAngle, endAngle) {
  const start = polarToCartesian(center, center, radius, endAngle);

  const end = polarToCartesian(center, center, radius, startAngle);

  return `
      M ${center} ${center}
      L ${start.x} ${start.y}
      A ${radius} ${radius} 0 0 0 ${end.x} ${end.y}
      Z
    `;
}

const SpinWheel = ({
  rotation,
  onSpin,
  isSpinning,
}) => {
  return (
    <div className="wheel-container">

      <div
        className="wheel"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >

        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
        ></svg>
                  {sections.map((section, index) => {

            const startAngle = index * 45;

            const endAngle = startAngle + 45;

            const middleAngle = startAngle + 22.5;

            const textPosition = polarToCartesian(

              center,

              center,

              145,

              middleAngle

            );

            return (

              <g key={index}>

                <path
                  d={describeSlice(startAngle, endAngle)}
                  fill={section.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                <text
                  x={textPosition.x}
                  y={textPosition.y}
                  fill="#ffffff"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${middleAngle}, ${textPosition.x}, ${textPosition.y})`}
                >

                  {section.text}

                </text>

              </g>

            );

          })}

          {/* Center Circle */}

          <circle

            cx="250"

            cy="250"

            r="48"

            fill="#111"

            stroke="#00B7FF"

            strokeWidth="6"

          />

          <text

            x="250"

            y="250"

            textAnchor="middle"

            dominantBaseline="middle"

            fill="#ffffff"

            fontSize="18"

            fontWeight="bold"

            style={{
              cursor: isSpinning ? "default" : "pointer"
            }}

            onClick={!isSpinning ? onSpin : undefined}

          >

            {isSpinning ? "..." : "START"}

          </text>

                    

      </div>

      /* Fixed Pointer */

      <div className="wheel-pointer">

        ▼

      </div>

    </div>

  );

};

export default SpinWheel;