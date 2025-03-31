import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { EventProvider } from "../context/eventContext";
import { AuthProvider } from "../context/authContext";
import RulesScreen from "../screens/RulesScreen";
import { formatDate } from "../helpers/utils";
import axios from "axios";
import CallbackRunner from "../components/CallbackRunner";
import CountdownTimer from "../components/CountdownTimer";
import Round1Screen from "./Round1Screen";
import Round2Screen from "./Round2Screen";
import Rounds from "../components/Rounds";

const CompetitionScreen = () => {
  const route = useLocation();
  const navigation = useNavigate();
  const { participant, setParticipant, challenge, setChallenge, allowRound1 } =
    EventProvider();
  const { isAuthenticated, token } = AuthProvider();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [round1Status, setRound1Status] = useState(null);
  const [round2Status, setRound2Status] = useState(null);
  const [showRound1, setShowRound1] = useState(false);
  const [showRound2, setShowRound2] = useState(false);
  const [r1Start, setR1Start] = useState(
    new Date(route?.state?.detail.round1_start_ts).getTime()
  );
  const [r1End, setR1End] = useState(
    new Date(route?.state?.detail.round1_end_ts).getTime()
  );
  const [r2Start, setR2Start] = useState(
    new Date(route?.state?.detail.round2_start_ts).getTime()
  );
  const [r2End, setR2End] = useState(
    new Date(route?.state?.detail.round2_end_ts).getTime()
  );

  useEffect(() => {
    setLoading(true);
    if (!isAuthenticated) navigation("/login");
    if (route?.state?.detail) {
      const { detail } = route.state;
      setChallenge(detail);
      secureLocalStorage.setItem("challenge", detail);
      setTimeout(() => {
        getStatus();
      }, 100);
      getParticipant();
    } else navigation("/");

    const now = new Date().getTime();
    console.log("load");
    const a = setTimeout(() => {
      getStatus();
      r1Start - now > 0 && setShowRound1(true);
      console.log("r1Start");
    }, r1Start - now + 100);
    const b = setTimeout(() => {
      getStatus();
      setShowRound1(false);
      console.log("r1End");
    }, r1End - now + 100);
    const c = setTimeout(
      getParticipant(),
      r2Start - now - 15000 - Math.round(Math.random() * 10000)
    );
    const d = setTimeout(() => {
      getStatus();
      r2Start - now > 0 && setShowRound2(true);
      console.log("r2Start");
    }, r2Start - now + 100);
    const e = setTimeout(() => {
      getStatus();
      setShowRound2(false);
      console.log("r2End");
    }, r2End - now + 100);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
      clearTimeout(d);
      clearTimeout(e);
    };
  }, []);

  const endRound1 = async (reason) => {
    const apiUrl = import.meta.env.VITE_BACKEND;
    try {
      console.log({ reason });
      const response = await axios.post(
        `${apiUrl}/challenge/${
          challenge.id || route?.state?.challenge_id
        }/end/round1`,
        { participant: participant.id, reason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedParticipant = response.data.data;
        setParticipant(updatedParticipant);
        secureLocalStorage.setItem(
          "participant",
          JSON.stringify(updatedParticipant)
        );
        setShowRound1(false);
        if (reason === "completed") alert("✅ Your Round 1 was Ended.");
        else if (reason === "tab-switch")
          alert("🚫 Your Round 1 was Ended due to Tab Switch.");
        else if (reason === "window-exit") {
          secureLocalStorage.removeItem(
            `e-${challenge.id}-${participant.id}-TS_${r1Start}`
          );
          alert(
            "🚫 Your Round 1 was Ended due to Exiting from Challenge Window."
          );
        }
      }
    } catch (error) {
      console.error("Error while ending round 1:", error);
      if (reason === "completed")
        alert(
          `❌ ${
            error.response.data?.message || "Something went wrong. Try again!"
          }`
        );
    }
  };

  const endRound2 = async (reason) => {
    const apiUrl = import.meta.env.VITE_BACKEND;
    try {
      const response = await axios.post(
        `${apiUrl}/challenge/${
          challenge.id || route?.state?.challenge_id
        }/end/round2`,
        { participant: participant.id, reason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedParticipant = response.data.data;
        setParticipant(updatedParticipant);
        secureLocalStorage.setItem(
          "participant",
          JSON.stringify(updatedParticipant)
        );
        setShowRound1(false);
        if (reason === "completed") alert("✅ Your Round 2 was Ended.");
        else if (reason === "window-exit") {
          secureLocalStorage.removeItem(
            `e-${challenge.id}-${participant.id}-TS_${r2Start}`
          );
          alert(
            "🚫 Your Round 2 was Ended due to Exiting from Challenge Window."
          );
        }
      }
    } catch (error) {
      console.error("Error while ending round 2:", error);
      if (reason === "completed")
        alert(
          `❌ ${
            error.response.data?.message || "Something went wrong. Try again!"
          }`
        );
    }
  };
  const joinChallenge = async () => {
    const apiUrl = import.meta.env.VITE_BACKEND;
    try {
      const response = await axios.post(
        `${apiUrl}/challenge/${
          challenge.id || route?.state?.challenge_id
        }/participation`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setParticipant(response.data.data);
        secureLocalStorage.setItem(
          "participant",
          JSON.stringify(response.data.data)
        );
        alert("✅ You have Participated in this Challenge Successfully");
      }
      if (response.status === 200) {
        setParticipant(response.data.data);
        secureLocalStorage.setItem(
          "participant",
          JSON.stringify(response.data.data)
        );
        alert("✅ You have Already Participated in this Challenge");
      }
    } catch (error) {
      console.error("Error joining challenge:", error);
      alert(
        `❌ ${
          error.response.data?.message || "Something went wrong. Try again!"
        }`
      );
    }
  };

  const getParticipant = async () => {
    if (!participant?.id) {
      const apiUrl = import.meta.env.VITE_BACKEND;
      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const response = await fetch(
          `${apiUrl}/challenge/${
            challenge.id || route?.state?.challenge_id
          }/participation`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setParticipant(data.data);
          secureLocalStorage.setItem("participant", JSON.stringify(data.data));
        } else {
          console.error("Failed to fetch participant:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching participant:", error);
      }
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   // getStatus();
  // }, [status, round1Status, round2Status]);

  const getCurrentStatus = (start, end) => {
    let now = new Date();
    if (start > now && end > now) return "Upcoming";
    if (start < now && end < now) return "Finished";
    else return "Ongoing";
  };
  const getStatus = () => {
    let status = getCurrentStatus(r1Start, r2End);
    let r1status = getCurrentStatus(r1Start, r1End);
    let r2status = getCurrentStatus(r2Start, r2End);

    setStatus(status);
    setRound1Status(r1status);
    setRound2Status(r2status);
  };
  return (
    <>
      <style>{style}</style>

      <section className="event-section">
        <div className="event-card">
          <img
            className="h-[500px]"
            src="/home_Image.png"
            alt="Combat the Prompt"
          />
          <div className="event-info self-center flex flex-col gap-[5px]">
            <h2>{challenge.event_name}</h2>
            <p className="w-[85%] mx-auto text-center">
              Organized by Department of CSE - Artificial Intelligence and Data
              Science
            </p>
            <p className="w-[85%] mx-auto text-center">
              Sagar Institute of Science and Technology | Gandhinagar | Bhopal
            </p>
            <br />
            <section className="mx-auto flex w-[85%] flex-col items-baseline justify-center">
              <div className="flex w-full items-center justify-between">
                <span className="text-md">
                  From : {formatDate(challenge.round1_start_ts)}
                </span>
                <span className="text-md">
                  To : {formatDate(challenge.round2_end_ts)}
                </span>
              </div>
              <div>Status : {status}</div>
            </section>

            <br />
            {status !== "Finished" && (
              <div className="countdown-section mt-5 w-[85%] mx-auto">
                {status === "Upcoming" ? (
                  <CountdownTimer endTime={challenge.round1_start_ts} />
                ) : (
                  <>
                    <h3>Already Started</h3>
                  </>
                )}
              </div>
            )}
            {(status === "Upcoming" || round1Status === "Ongoing") &&
              !participant?.id && (
                <button
                  onClick={() => {
                    if (!confirm("You want to Participate in this ?")) return;
                    joinChallenge();
                  }}
                  className="register-btn w-fit-content mx-auto"
                  disabled={
                    new Date(challenge.round1_end_ts) - 1000 < new Date()
                  }
                >
                  Participate
                </button>
              )}
          </div>
        </div>
        <div className="event-card">
          <RulesScreen width="100%" />
          <div className="event-info">
            <h2>{challenge.event_name}</h2>
            <Rounds
              showRound1={() => setShowRound1(true)}
              showRound2={() => setShowRound2(true)}
              round1Status={round1Status}
              round2Status={round2Status}
            />
          </div>
        </div>
      </section>

      <div className="footer-spacing"></div>
      {participant?.id &&
        !participant.round1_end_reason &&
        showRound1 &&
        round1Status === "Ongoing" && (
          <Round1Screen closeTest={endRound1} setShowRound1={setShowRound1} />
        )}
      {participant?.id &&
        !participant.round2_end_reason &&
        participant?.round1_status === "qualified" &&
        showRound2 &&
        round2Status === "Ongoing" && (
          <Round2Screen closeTest={endRound2} setShowRound2={setShowRound2} />
        )}
    </>
  );
};

const style = `
/* Background Styling with Gradient */
    body {
        background: linear-gradient(135deg, #0F2027, #203A43, #2C5364);
        color: #00FFFF;
        overflow-x: hidden;
        font-family: 'Poppins', sans-serif;
        min-height: 100vh;
        /* Ensures the full height is covered */
    }

    /* Hero Section */
    .hero {
        text-align: center;
        padding: 40px 20px;
        font-weight: bold;
        animation: fadeIn 1s ease-in-out;
        margin: 20px auto;
        width: 90%;
    }

    .hero h1 {
        font-size: 2.8rem;
        margin: 0;
    }

    /* Floating Bubbles */
    .bubble {
        position: absolute;
        width: 50px;
        height: 50px;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.8), rgba(0, 255, 255, 0.1));
        border-radius: 50%;
        opacity: 0.6;
        z-index: 1;
        animation: floatUp 8s infinite linear;
    }

    @keyframes floatUp {
        0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0.4;
        }

        50% {
            opacity: 0.8;
        }

        100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
        }
    }

    /* Event Section */
    .event-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        padding: 30px 0;
        position: relative;
        z-index: 10;
        gap: 10px;
    }

    /* Event Card Styling */
    .event-card {
        background: rgba(20, 20, 20, 0.9);
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
        overflow: hidden;
        padding: 20px;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        width: 90%;
        margin: auto;
        position: relative;
        z-index: 10;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .event-card img {
        width: 96%;
        margin: 2%;
        object-fit: cover;
        border-radius: 10px;
    }

    .event-info {
        padding: 10px;
        text-align: center;
    }

    .event-info h2 {
        font-size: 24px;
        font-weight: bold;
        color: rgb(218, 179, 153);
    }

    .event-info p {
        font-size: 14px;
        color: white;
    }

    /* Countdown, Date & Prize Pool Styling */
    .event-meta {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 15px 0;
        padding: 8px;
        background: rgba(0, 255, 255, 0.2);
        border-radius: 10px;
    }

    .event-meta span {
        font-size: 1.2rem;
        font-weight: bold;
        color: #00FFFF;
    }

    /* Countdown Styling */
    .countdown-section {
        text-align: center;
        background: rgba(0, 255, 255, 0.2);
        border-radius: 10px;
        padding: 12px;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
    }

    .countdown-container {
        display: flex;
        justify-content: center;
        gap: 12px;
    }

    .time-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 1.3rem;
        font-weight: bold;
        color: #00FFFF;
    }

    .time-label {
        font-size: 1rem;
        font-weight: normal;
    }

    /* Registration Button */
    .register-btn {
        display: inline-block;
        background: #FFD700;
        color: #0F2027;
        padding: 10px 20px;
        font-size: 1.1rem;
        font-weight: bold;
        border-radius: 8px;
        text-decoration: none;
        transition: 0.3s ease-in-out;
        margin-top: 10px;
    }

    .register-btn:hover {
        background: #00EEEE;
        box-shadow: 0 0 10px #00FFFF;
    }

    /* Footer Spacing */
    .footer-spacing {
        height: 20px;
        /* Reduced spacing as we fixed the footer positioning */
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
        .rules-container {
            width: 70%;
            padding: 30px;
        }
    }

    @media (max-width: 768px) {
        .rules-container {
            width: 85%;
            padding: 25px;
        }

        .rules-container h2 {
            font-size: 24px;
        }

        .rules-container li {
            font-size: 16px;
            padding: 10px;
        }
    }

    @media (max-width: 480px) {
        .rules-container {
            width: 95%;
            padding: 20px;
        }

        .rules-container h2 {
            font-size: 22px;
        }

        .rules-container li {
            font-size: 14px;
            padding: 8px;
        }
    } 
`;

export default CompetitionScreen;
