import React from 'react';

const Left_ad = () => {
  const sidebarStyle = {
    position: 'fixed',
    top: '100px',
    left: '20px', // 👈 Changed from 'right' to 'left'
    width: '160px',
    height: '600px',
    backgroundColor: '#303030',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffffcc',
    fontFamily: 'sans-serif',
    zIndex: 1000,
    textAlign: 'center',
    flexDirection: 'column',
  };

  const sizeTextStyle = {
    marginTop: '8px',
    fontSize: '14px',
    color: '#cccccc',
  };

  return (
    <div style={sidebarStyle}>
      <div>
        <p style={{ fontSize: '18px', margin: 0 }}>Left_ad</p>
        <span style={sizeTextStyle}><p>width x height: </p><p> 160px & 600px</p></span>
      </div>
    </div>
  );
};

export default Left_ad;
