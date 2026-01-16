import React, { useState, useEffect } from 'react';
import './ProgressBar.css';

const ProgressBar = ({ count }) => {
  const max = 10;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percentage = Math.min((count / max) * 100, 100);
    setProgress(percentage);
  }, [count]);

  return (
    <div className="progress-page">
      {/* Show count/max in top-left */}
      

      <div className="bottom-progress-container">
        <div
          className="bottom-progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
        <span className="bottom-progress-text">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
