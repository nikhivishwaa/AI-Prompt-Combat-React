import React, { useEffect, useState } from "react";
import R1Task from "../components/R1Task";
import { EventProvider } from "../context/eventContext";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { AuthProvider } from "../context/authContext";
import ReverseTimer from "../components/ReverseTimer";

function Round1Screen({ closeTest, setShowRound1 }) {
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastTimout, setLastTimout] = useState(null);
  const { token } = AuthProvider();
  const {
    participant,
    challenge,
    round1,
    setRound1,
    allowRound1,
    setAllowRound1,
  } = EventProvider();
  const [tabSwitch, setTabSwitch] = useState(0);

  useEffect(() => {
    async function getAllTask() {
      try {
        const apiUrl = import.meta.env.VITE_BACKEND;
        const url = `${apiUrl}/challenge/${challenge.id}/round1/?participant=${participant.id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        secureLocalStorage.setItem("round1", JSON.stringify(data.data));
        console.log(data);
        setRound1(data.data);
      } catch (error) {
        console.error("Error while fetching tasks: ", error);
      } finally {
        setLoading(false);
      }
    }

    const r1exists = secureLocalStorage.getItem(
      `e-${challenge.id}-${participant.id}-TS_${new Date(
        challenge.round1_start_ts
      ).getTime()}`
    );
    if (r1exists) {
      closeTest("window-exit");
    }

    setLoading(true);
    if (participant.round1_end_reason) {
      setShowRound1(false);
      return;
    }
    getAllTask();
    const endTs = new Date(challenge.round1_end_ts);
    const r1End = setTimeout(
      () => closeTest("time-up"),
      endTs - new Date() - 600
    );
    // set the round 1 started
    secureLocalStorage.setItem(
      `e-${challenge.id}-${participant.id}-TS_${new Date(
        challenge.round1_start_ts
      ).getTime()}`,
      true
    );
    const disableRightClick = (e) => e.preventDefault();
    const disableCopy = (e) => e.preventDefault();
    const disableCut = (e) => e.preventDefault();
    const disablePaste = (e) => e.preventDefault();

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("copy", disableCopy);
    document.addEventListener("cut", disableCut);
    document.addEventListener("paste", disablePaste);

    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "";
      clearTimeout(r1End);
      console.log({ closed: "yes" });
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("cut", disableCut);
      document.removeEventListener("paste", disablePaste);
    };
  }, []);
  useEffect(() => {
    const handleVisibilityChange = (e) => {
      e.stopPropagation();
      if (document.hidden) {
        console.log({ tabSwitch });
        setTimeout(() => {
          setTabSwitch((prev) => prev + 1);
        }, 80);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    enableFullScreen();

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [round1]);

  useEffect(() => {
    if (tabSwitch >= 2) {
      console.log({ tabSwitch });
      closeTest("tab-switch");
    } else {
      tabSwitch && alert("⚠️ Tab switch detected! Please stay on this page.");
    }
  }, [tabSwitch]);

  const enableFullScreen = () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } catch (error) {
      console.log("Error enabling full screen: ", error);
    }
  };
  return (
    <>
      <style>{style}</style>
      <main
        style={{
          position: "fixed",
          height: "100%",
          width: "100%",
          zIndex: 2000,
          overflowX: "hidden",
        }}
      >
        <div className="level-container">
          {tabSwitch < 2 ? (
            <section className="prompt-card" id="prompt-card">
              {!loading &&
                round1.map((task, i) => (
                  <R1Task task={task} i={i + 1} key={i} />
                ))}
            </section>
          ) : (
            <h1 className="text-[28px] justify-self-center font-bold">
              Your Round 1 is Forcefully Submitted, Due to Tabswitch
            </h1>
          )}
          <aside className="flex flex-col gap-1 sidebar-container self-start w-[94%] mr-auto">
            <h2 className="title">Level 1: Prompt Writing</h2>
            <p className="text-center description">
              Write a detailed prompt based on the given conditions and submit.
            </p>

            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  round1.map((task, i) => (
                    <tr key={i}>
                      <td>
                        <button onClick={() => {}}>Task # {i + 1}</button>
                      </td>
                      <td>{task?.evaluated ? `✅` : "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="my-4">
              <ReverseTimer stopAt={new Date(challenge.round1_end_ts) - 2000} />
            </div>
            <div className="flex justify-center mt-5">
              <button
                onClick={() => {
                  if (!confirm("Are you sure? you want to end Round 1!"))
                    return;
                  closeTest("completed");
                }}
                className="register-btn w-fit-content mx-auto"
              >
                End Round 1
              </button>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

const style = `
th {
        height: 40px;
        vertical-align: center;
        /* text-align: center; */
        border-bottom: 1px solid #00FFFF;
    }

    td {
        height: 50px;
        vertical-align: center;
        text-align: center;
    }

    tr:nth-child(even) {
        background-color: #332028;
    }

    tr:nth-child(odd) {
        background-color: #203330;
    }

    /* Countdown Styling */
    .countdown-section {
        text-align: center;
        background: rgba(0, 255, 255, 0.2);
        border-radius: 10px;
        padding: 10px;
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
        font-size: 1.1rem;
        font-weight: bold;
        color: #00FFFF;
    }

    .time-label {
        font-size: 0.8rem;
        font-weight: normal;
    }

    /* Registration Button */
    .register-btn {
        display: inline-block;
        background: #FFD700;
        color: #0F2027;
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: bold;
        border-radius: 8px;
        text-decoration: none;
        transition: 0.2s ease-in-out;
        margin-top: 10px;
    }

    .register-btn:hover {
        background: #00EEEE;
        box-shadow: 0 0 10px #00FFFF;
    }


    /* Full Page Styling */
    .level-container {
        display: grid;
        grid-template-columns: 6fr 3fr;
        justify-content: center;
        align-items: center;
        height: 100%;
        /* Account for header and footer */
        padding: 20px 0;
        width: 90%;
        margin: auto;
        box-sizing: border-box;
        background: rgba(20, 20, 20, 0.9);
    }

    /* Card Styling */
    .sidebar-container {
        background: rgba(20, 20, 20, 0.9);
        padding: 40px;
        border-radius: 15px;
        height: fit-content;
        position: sticky;
        top: 90px;
        border: 1px solid #00FFFF;
        box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
        transition: all 0.3s ease-in-out;
        /* animation: fadeIn 0.8s ease-in-out; */
    }

    .prompt-card {
        overflow-y: auto;
        scrollbar-width: none;
        scroll-behavior: smooth;
        height: 100%;

    }

    /* Title Styling */
    .title {
        font-weight: bold;
        margin-bottom: 20px;
        font-size: 1.5rem;
        text-align: center;
        color: #00FFFF;
    }

    /* Description */
    .description {
        font-size: 1.1rem;
        color: #00EEEE;
        margin-bottom: 25px;
    }

    /* Question Styling */
    .question {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        gap: 5px;
        background: rgba(20, 20, 20, 0.9);
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
        box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        animation: fadeIn 0.8s ease-in-out;

    }

    h5 {
        font-weight: 600;
        margin-bottom: 8px;
        color: #00FFFF;
    }

    /* Textarea Styling */
    textarea {
        width: 100%;
        border-radius: 8px;
        border: 1px solid #00FFFF;
        padding: 12px;
        font-size: 1rem;
        background: rgba(0, 255, 255, 0.1);
        color: white;
        transition: all 0.3s ease-in-out;
    }

    textarea:focus {
        border-color: #00FFFF;
        box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
        outline: none;
    }

    /* Submit Button */
    .submit-container {
        text-align: center;
        margin-top: 15px;
    }

    .btn-primary {
        padding: 12px 20px;
        font-size: 1.2rem;
        font-weight: bold;
        text-decoration: none;
        background: #00FFFF;
        border-radius: 8px;
        transition: all 0.2s ease-in-out;
        box-shadow: 0 4px 8px rgba(0, 255, 255, 0.4);
        border: none;
        color: black;
        cursor: pointer;
        /* {% if challenge.round1_status == 'Finished' %} */
        cursor: not-allowed;
        /* {% endif %} */
    }

    .btn-primary:hover {
        background: #00EEEE;
        box-shadow: 0 0 10px #00FFFF;
        transform: scale(1.05);
    }

    /* Fade-in Animation */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .prompt-card {
            width: 85%;
            padding: 30px;
        }

        .title {
            font-size: 1.8rem;
        }

        .question h5 {
            font-size: 1rem;
        }

        textarea {
            font-size: 0.9rem;
        }

        .btn-primary {
            font-size: 1rem;
            padding: 10px 16px;
        }
    }

    @media (max-width: 480px) {
        .prompt-card {
            width: 95%;
            padding: 25px;
        }

        .title {
            font-size: 1.5rem;
        }

        .question h5 {
            font-size: 0.9rem;
        }

        textarea {
            font-size: 0.8rem;
            padding: 10px;
        }

        .btn-primary {
            font-size: 1rem;
            padding: 10px 14px;
        }
    }
`;

export default Round1Screen;
