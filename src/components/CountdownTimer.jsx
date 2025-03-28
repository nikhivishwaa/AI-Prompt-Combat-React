import React, { useEffect, useState } from "react";

const CountdownTimer = ({ endTime, setStarted }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(endTime) - new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      // setStarted(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      
    const difference = new Date(endTime) - new Date();
      difference > 0 && setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <h3>Time Remaining:</h3>
      <div className="countdown-container">
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div key={unit} className="time-box">
            <span>{timeLeft[unit]}</span>
            <span className="time-label">
              {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default CountdownTimer;
