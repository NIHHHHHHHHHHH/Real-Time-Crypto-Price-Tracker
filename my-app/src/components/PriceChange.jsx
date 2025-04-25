import React from 'react';

const PriceChange = ({ value }) => {
  // Determine color based on the value
  // Green for positive, red for negative, and gray for zero
  const color = value > 0 ? 'green' : value < 0 ? 'red' : 'gray';
  
  // Set arrow based on value direction
  const arrow = value > 0 ? '▲' : value < 0 ? '▼' : '';
  
  return (
    // Display value with corresponding color and arrow
    <span style={{ color }}>
      {arrow} {Math.abs(value).toFixed(2)}%
    </span>
  );
};

export default PriceChange;
