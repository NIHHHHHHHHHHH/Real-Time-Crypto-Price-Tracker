import React from 'react';
import { LineChart, Line } from 'recharts';

const MiniChart = ({ data, positive }) => {
  // Generate sample data if real data is not provided
  const chartData = data || Array.from({ length: 10 }, (_, i) => {
    // If the trend is positive, generate data decreasing slightly
    // If the trend is negative, generate data increasing slightly
    if (positive) {
      return { value: 30 - Math.random() * i * 3 };
    } else {
      return { value: 10 + Math.random() * i * 3 };
    }
  });

  // Set color based on the trend direction (positive or negative)
  const color = positive ? '#22c55e' : '#ef4444'; // Tailwind green-500 and red-500

  return (
    // Fixed width and height for the chart
    <LineChart width={100} height={40} data={chartData}>
      {/* Line representing the trend, no dots, and no animation */}
      <Line
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  );
};

export default MiniChart;
