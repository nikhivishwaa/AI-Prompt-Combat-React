import React, { useEffect, useState } from "react";
import { formatDate } from "../helpers/utils";
import CountdownTimer from "./CountdownTimer";
import { useNavigate } from "react-router-dom";
import CallbackRunner from "../components/CallbackRunner";

function ChallengeCard({ challenge }) {
  const [status, setStatus] = useState(null);
  const [startTs, setStartTs] = useState(new Date(challenge.round1_start_ts));
  const [finisTs, setFinishTs] = useState(new Date(challenge.round2_end_ts));
  const navigation = useNavigate();

  useEffect(() => {
    getStatus();
    const now = new Date();
    const a = setTimeout(() => {
      getStatus();
      console.log("Start");
    }, startTs - now + 100);
    const b = setTimeout(() => {
      getStatus();
      console.log("End");
    }, finisTs - now + 100);

    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const getStatus = () => {
    let now = new Date();
    let status =
      now > finisTs ? "Finished" : now < startTs ? "Upcoming" : "Ongoing";
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
                <CountdownTimer endTime={challenge.round1_start_ts} />
              ) : (
                <>
                  <h3>Already Started</h3>
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
