import React from 'react';

const TotalCount = ({ total }) => {
  return (
    <div style={{ marginTop: '20px', fontSize: '16px',marginBottom:'-10px' ,paddingBottom :'-50'}}>
      <strong>Total Clicks: {total}</strong>
    </div>
  );
};

export default TotalCount;
