import React, { useState, useEffect } from "react";

const ReverseTimer = ({
  stopAt,
  initialTime = 300,
  title = "Ends In",
  callback = () => {},
}) => {
  // Default 5 minutes countdown
  const [timeLeft, setTimeLeft] = useState(
    stopAt ? stopAt - new Date() : initialTime
  );

  useEffect(() => {
    if (timeLeft <= 1100) {
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
    <div className="flex flex-col items-center gap-2 p-4 border rounded-xl shadow-lg w-64 mx-auto">
      <h2 className="text-[18px] font-bold">{title}</h2>
      <div className="text-[22px] font-mono">{formatTime(timeLeft)}</div>
      {timeLeft > 0 && timeLeft < 10000 && (
        <p className="text-yellow-500 text-[11px] text-justify">
          ⚠️ Make sure you Submit all task before counter stops
        </p>
      )}
      {timeLeft === 0 && <p className="text-red-500">Time's up!</p>}
    </div>
  );
};

export default ReverseTimer;
