import React from 'react';

const Timer = ({ seconds }) => {
  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
      ⏳ {formatTime(seconds)}
    </span>
  );
};

export default Timer;
