import React, { useState } from "react";
import { EventProvider } from "../context/eventContext";

function Rounds({ showRound1, showRound2, round1Status, round2Status }) {
  const { participant, setParticipant, challenge, setChallenge, allowRound1 } =
    EventProvider();
  //   const { isAuthenticated, token } = AuthProvider();
  const [status, setStatus] = useState(null);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  return (
    <>
      <style>{style}</style>

      <div class="competition-wrapper">
        {participant.id ? (
          <div class="competition-container">
            <p>
              Get ready to test your AI prompting skills in an intense battle of
              creativity!
            </p>

            <div class="round-box-container">
              <div class="round-box" id="round1">
                <div class="round-title">Round 1</div>
                {round1Status == "Upcoming" && (
                  <>
                    <p>Click below to start Round 1.</p>
                    <button
                      class="round-button cursor-not-allowed"
                      disabled={true}
                    >
                      Upcoming
                    </button>
                  </>
                )}
                {round1Status == "Ongoing" && (
                  <>
                    <p>Click below to attempt Round 1.</p>
                    <button
                      onClick={showRound1}
                      class="round-button hover:cursor-pointer cursor-pointer"
                    >
                      <span class="text-red-500">*</span> Attempt
                    </button>
                  </>
                )}
                {round1Status == "Finished" && (
                  <>
                    <p>Round 1 is Over</p>
                    <buttom
                      class="round-button cursor-not-allowed"
                      disabled={true}
                    >
                      Finished
                    </buttom>
                  </>
                )}
              </div>

              {participant.round1_status === "qualified" ? (
                <div class="round-box" id="round2">
                  <div class="round-title">Round 2</div>
                  {round2Status == "Upcoming" && (
                    <>
                      <p>Click below to start Round 2.</p>
                      <button
                        disabled={true}
                        class="round-button cursor-not-allowed"
                      >
                        Upcoming
                      </button>
                    </>
                  )}
                  {round2Status == "Ongoing" && (
                    <>
                      <p>Click below to attempt Round 2.</p>
                      <button
                        onClick={showRound2}
                        class="round-button hover:cursor-pointer cursor-pointer"
                      >
                        <span class="text-red-500">*</span> Attempt
                      </button>
                    </>
                  )}

                  {round2Status == "Finished" && (
                    <>
                      <p>Round 2 is Over</p>
                      <button
                        disabled={true}
                        class="round-button cursor-not-allowed"
                      >
                        Finished
                      </button>
                    </>
                  )}
                </div>
              ) : (
                round2Status !== "Upcoming" && (
                  <div class="round-box" id="round2">
                    <div class="round-title">Round 2</div>

                    <p>You haven't qualified Round 1.</p>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="competition-container">
            <h1 className="text-center">
              you haven't Participated in this Competition Yet
            </h1>
          </div>
        )}
      </div>
    </>
  );
}

const style = `
/* Ensuring Full Page Centering */
    .competition-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 150px);
        /* Account for header and footer */
        text-align: center;
        padding: 20px 0;
    }

    /* Main Competition Container */
    .competition-container {
        background: rgba(20, 20, 20, 0.9);
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
        width: 80%;
        max-width: 700px;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .competition-container:hover {
        transform: scale(1.02);
        box-shadow: 0 10px 20px rgba(0, 255, 255, 0.4);
    }

    /* Title Styling */
    .competition-container h1 {
        font-size: 2.5rem;
        font-weight: bold;
        color: #00FFFF;
        margin-bottom: 10px;
    }

    .competition-container p {
        font-size: 1.2rem;
        color: #00EEEE;
        margin-bottom: 20px;
    }

    /* Round Box Container */
    .round-box-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        width: 100%;
    }

    /* Round Box Styling */
    .round-box {
        background: rgba(0, 255, 255, 0.2);
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 255, 255, 0.3);
        width: 45%;
        max-width: 300px;
        cursor: pointer;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        text-align: center;
    }

    .round-box:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 20px rgba(0, 255, 255, 0.4);
    }

    .round-title {
        font-size: 1.8rem;
        font-weight: bold;
        color: #00FFFF;
        margin-bottom: 10px;
    }

    .round-box p {
        font-size: 1rem;
        color: #00EEEE;
    }

    /* Button Styling */
    .round-button {
        display: inline-block;
        padding: 10px 20px;
        margin-top: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        text-decoration: none;
        color: #0F2027;
        background: #00FFFF;
        border-radius: 8px;
        transition: 0.3s ease-in-out;
        box-shadow: 0 4px 8px rgba(0, 255, 255, 0.4);
    }

    .round-button:hover {
        background: #00EEEE;
        box-shadow: 0 0 10px #00FFFF;
        transform: scale(1.05);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .competition-container {
            width: 90%;
            padding: 30px;
        }

        .round-box-container {
            flex-direction: column;
        }

        .round-box {
            width: 90%;
            max-width: 400px;
        }

        .round-title {
            font-size: 1.5rem;
        }

        .round-button {
            font-size: 1rem;
            padding: 8px 16px;
        }
    }

    @media (max-width: 480px) {
        .competition-container {
            width: 95%;
            padding: 20px;
        }

        .round-title {
            font-size: 1.4rem;
        }

        .round-button {
            font-size: 1rem;
            padding: 8px 14px;
        }
    }
`;
export default Rounds;
