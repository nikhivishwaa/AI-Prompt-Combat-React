import { useState, useEffect } from "react";
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

  const getChallenge = async () => {
    if (route?.state?.detail) {
      setChallenge(route.state.detail);
      secureLocalStorage.setItem("challenge", route.state.detail);
    } else navigation("/");
  };
  useEffect(() => {
    if (isAuthenticated) {
      console.log({ token });
      setLoading(true);
      getChallenge();
      getParticipant();
    } else navigation("/login");
  }, []);

  const joinChallenge = async () => {
    const apiUrl = import.meta.env.VITE_BACKEND;
    const response = await axios.post(
      `${apiUrl}/challenge/${
        challenge.id || route?.state?.challenge_id
      }/participation`,
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
    }
  };

  const getParticipant = async () => {
    if (!participant?.id) {
      const apiUrl = import.meta.env.VITE_BACKEND;
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const response = await axios.get(
        `${apiUrl}/challenge/${
          challenge.id || route?.state?.challenge_id
        }/participation`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setParticipant(response.data.data);
        secureLocalStorage.setItem(
          "participant",
          JSON.stringify(response.data.data)
        );
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getStatus();
  }, [loading, started, finished]);

  const getStatus = () => {
    let now = new Date().getTime();
    let start = new Date(challenge.round1_start_ts).getTime();
    let r1end = new Date(challenge.round1_end_ts).getTime();
    let r2start = new Date(challenge.round2_start_ts).getTime();
    let end = new Date(challenge.round2_end_ts).getTime();
    let status = now > end ? "Finished" : now < start ? "Upcoming" : "Ongoing";
    setStatus(status);
    let r1status =
      now > r1end ? "Finished" : now < start ? "Upcoming" : "Ongoing";
    setRound1Status(r1status);
    let r2status =
      now > end ? "Finished" : now < r2start ? "Upcoming" : "Ongoing";
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
            {/* <div className="event-meta">
                <span>📅 April 3, 2025</span>
                <span>🏆 Prize Pool ₹ 7000</span>
            </div> */}
            <section className=" mx-auto flex w-[85%] flex-col items-baseline justify-center">
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
                  <CountdownTimer
                    endTime={challenge.round1_start_ts}
                    setStarted={setStarted}
                  />
                ) : (
                  <>
                    <h3>Already Started</h3>
                    {!finished && (
                      <CallbackRunner
                        endTs={challenge.round2_end_ts}
                        callback={() => {
                          setFinished(true);
                          setShowRound2(false);
                        }}
                      />
                    )}
                    {showRound1 && (
                      <CallbackRunner
                        endTs={challenge.round1_start_ts}
                        callback={() => setShowRound1(false)}
                      />
                    )}
                  </>
                )}
              </div>
            )}
            {(status === "Upcoming" || round1Status === "Ongoing") &&
              !participant?.id && (
                <button
                  onClick={joinChallenge}
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
      {participant?.id && showRound1 && (
        <Round1Screen closeTest={() => setShowRound1(false)} />
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
