import React from 'react';

const Bottom_ad = () => {
  const adStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '728px',
    height: '90px',
    backgroundColor: '#303030',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffffcc',
    fontFamily: 'sans-serif',
    flexDirection: 'column',
    textAlign: 'center',
  };

  const sizeTextStyle = {
    marginTop: '8px',
    fontSize: '14px',
    color: '#cccccc',
  };

  return (
    <div style={adStyle}>
      <div>
        <p style={{ fontSize: '18px', margin: 0 }}>Ad Space</p>
        <span style={sizeTextStyle}>300 × 250</span>
      </div>
    </div>
  );
};

export default Bottom_ad;
