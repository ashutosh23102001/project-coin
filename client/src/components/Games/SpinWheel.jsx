import "./SpinWheel.css";

const sections = [
  {
    id: 1,
    label: "10",
    color: "#2ECC71",
  },
  {
    id: 2,
    label: "Better Luck",
    color: "#E74C3C",
  },
  {
    id: 3,
    label: "30",
    color: "#F1C40F",
  },
  {
    id: 4,
    label: "Better Luck",
    color: "#3498DB",
  },
  {
    id: 5,
    label: "10",
    color: "#9B59B6",
  },
  {
    id: 6,
    label: "Better Luck",
    color: "#1ABC9C",
  },
  {
    id: 7,
    label: "10",
    color: "#FF9800",
  },
  {
    id: 8,
    label: "Better Luck",
    color: "#607D8B",
  },
];

const SpinWheel = ({ rotation }) => {
  return (
    <div className="wheel-container">
      <div
        className="wheel"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {sections.map((item, index) => {
          return (
            <div
              key={item.id}
              className="slice"
              style={{
                transform: `rotate(${index * 45}deg) skewY(-45deg)`,
                background: item.color,
              }}
            >
              <span
                className="slice-text"
                style={{
                  transform: "skewY(45deg) rotate(22.5deg)",
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}

        <div className="wheel-center">
          🎁
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;