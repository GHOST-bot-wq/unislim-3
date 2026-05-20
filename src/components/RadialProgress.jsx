import React, { useEffect, useState } from 'react';

const RadialProgress = ({ percentage = 0, streak = 0 }) => {
  const radius = 64;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="radial-progress-container animate-scale-up">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="radial-progress-svg"
      >
        <circle
          stroke="var(--color-primary-light)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="var(--color-primary)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
      <div className="radial-progress-content">
        <span className="streak-count">{streak}</span>
        <span className="streak-unit">{streak === 1 ? 'dia' : 'dias'}</span>
        <span className="streak-label">cuidando de você</span>
      </div>
    </div>
  );
};

export default RadialProgress;
