import React, { use, useEffect, useState } from "react";

function CallbackRunner({ callback, endTs, earlystop = 0 }) {
  const [timeLeft, setTimeLeft] = useState();
  const calculateTimeLeft = () => {
    const difference = new Date(endTs) - earlystop * 1000 - new Date();
    if (difference > 0) {
      return difference;
    } else {
      callback();
      return 0;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div className="hidden"></div>;
}

export default CallbackRunner;
