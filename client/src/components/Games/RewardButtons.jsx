import "./RewardButtons.css";

const RewardButtons = ({ selectedReward, setSelectedReward }) => {
  return (
    <div className="reward-container">

      <h2 className="reward-title">
        Choose Expected Reward
      </h2>

      <div className="reward-buttons">

        <button
          className={
            selectedReward === 10
              ? "reward-btn active"
              : "reward-btn"
          }
          onClick={() => setSelectedReward(10)}
        >
          💰 10 Points
        </button>

        <button
          className={
            selectedReward === 30
              ? "reward-btn active"
              : "reward-btn"
          }
          onClick={() => setSelectedReward(30)}
        >
          👑 30 Points
        </button>

      </div>

      {selectedReward && (

        <div className="selected-reward">

          Selected :

          <strong>

            {selectedReward} Points

          </strong>

        </div>

      )}

    </div>
  );
};

export default RewardButtons;