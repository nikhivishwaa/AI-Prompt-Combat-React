import React, { useState, useEffect } from "react";

const ReverseTimer = ({
  initialTime = 300,
  title = "Ends In",
  callback = () => {},
}) => {
  // Default 5 minutes countdown
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timeLeft > -1000) {
        callback();
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1000);
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [timeLeft]);

  const formatTime = (millieconds) => {
    const seconds = Math.floor(millieconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4 border rounded-xl shadow-lg w-64">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="text-3xl font-mono">{formatTime(timeLeft)}</div>
      {timeLeft === 0 && <p className="text-red-500">Time's up!</p>}
    </div>
  );
};

export default ReverseTimer;
