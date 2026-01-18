import React, { useState, useEffect } from 'react';
import { getTimeLeft } from '../utils/competition';
import './Countdown.css';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft.isOver) {
    return (
      <div className="countdown-container">
        <div className="countdown-over">
          <h2>比赛已结束</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="countdown-container">
      <h2 className="countdown-title">距离比赛结束还有</h2>
      <div className="countdown-display">
        <div className="countdown-item">
          <span className="countdown-number">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="countdown-label">天</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="countdown-label">时</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="countdown-label">分</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="countdown-label">秒</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
