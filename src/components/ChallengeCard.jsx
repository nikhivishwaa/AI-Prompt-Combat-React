import React, { useEffect, useState } from "react";
import { formatDate } from "../helpers/utils";
import CountdownTimer from "./CountdownTimer";
import { useNavigate } from "react-router-dom";
import CallbackRunner from "../components/CallbackRunner";

function ChallengeCard({ challenge }) {
  const [status, setStatus] = useState(null);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    getStatus();
  }, []);
  useEffect(() => {
    getStatus();
  }, [started, finished]);

  const getStatus = () => {
    let now = new Date().getTime();
    let start = new Date(challenge.round1_start_ts).getTime();
    let end = new Date(challenge.round2_end_ts).getTime();
    let status = now > end ? "Finished" : now < start ? "Upcoming" : "Ongoing";
    setStatus(status);
  };
  return (
    <>
      <div className="event-card">
        <img
          className="h-[500px]"
          src="/home_Image.png"
          alt="Combat the Prompt"
        />
        <div className="event-info">
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
            </div>  */}
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
                  <CallbackRunner
                    endTs={challenge.round2_end_ts}
                    callback={() => setFinished(true)}
                  />
                </>
              )}
            </div>
          )}{" "}
          <br />
          <button
            onClick={() => {
              navigation(`/competition`, {
                state: {
                  challenge_id: challenge.id,
                  detail: challenge,
                },
              });
            }}
            className="register-btn"
          >
            Go To Competition
          </button>
        </div>
      </div>
    </>
  );
}

export default ChallengeCard;
