import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { trophySvg } from "../data/svgImageData";
import RenderSvg from "../components/RenderSvg";

function LeaderBoardScreen() {
  const leaderboardData = [
    { name: "Player 1", score: 100 },
    { name: "Player 2", score: 90 },
    { name: "Player 3", score: 80 },
    { name: "Player 4", score: 70 },
    { name: "Player 5", score: 60 },
    { name: "Player 6", score: 50 },
    { name: "Player 7", score: 40 },
    { name: "Player 8", score: 30 },
    { name: "Player 9", score: 20 },
    { name: "Player 10", score: 10 },
    { name: "Player 5", score: 60 },
    { name: "Player 6", score: 50 },
    { name: "Player 7", score: 40 },
    { name: "Player 8", score: 30 },
    { name: "Player 9", score: 20 },
    { name: "Player 10", score: 10 },
  ];
  const [round, setRound] = useState(1);

  return (
    <>
      <style>{style}</style>
      <div className="leaderboard-container">
        <div className="leaderboard-card relative">
          <section className="absolute top-[1%] right-[1%] flex gap-4 justify-center items-center">
            <div
              className={`notification-bar p-[10px]${
                round === 1 && " border-1"
              }`}
            >
              <Link
                to="{% url 'challenge:get_leaderboard_r1' challenge_no %}"
                className="notification-link"
              >
                <div className="notification-icon">
                  <RenderSvg svgName={trophySvg} style={{ fill: "#00ffff" }} />
                </div>
                <h3 className="notification-title">Round 1</h3>
              </Link>
            </div>
            <div
              className={`notification-bar p-[10px]${
                round === 2 && " border-1"
              }`}
            >
              <Link
                to="{% url 'challenge:get_leaderboard_r2' challenge_no %}"
                className="notification-link"
              >
                <div className="notification-icon">
                  <RenderSvg svgName={trophySvg} style={{ fill: "#00ffff" }} />
                </div>
                <h3 className="notification-title">Round 2</h3>
              </Link>
            </div>
          </section>
          <h2 className="title">Leaderboard</h2>
          <p className="description">Top participants based on their scores.</p>

          <div className="table-responsive">
            <table className="table leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Submission Time</th>
                  <th>Submitted Task </th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {/* {% for participant in user_ranking %} */}
                {leaderboardData?.length ? (
                  leaderboardData.map((val, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{val.name}</td>
                      <td>abc@gmail.com</td>
                      <td>submission_time</td>
                      <td>{Math.round(Math.random() * 4)}</td>
                      <td>{val.score}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colspan="3" className="text-center">
                      No submissions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

const style = `/* Full Page Styling */
    .leaderboard-container {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin: 2% 0px;
        position: static;
        z-index: 2;
    }

    /* Card Styling */
    .leaderboard-card {
        background: rgba(20, 20, 20, 0.9);
        padding: 30px;
        /* Reduced padding */
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 255, 255, 0.3);
        min-width: 60%;
        /* Smaller width */
        width: fit-content;
        /* More compact */
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        animation: fadeIn 0.8s ease-in-out;
    }

    /* Hover Effect */
    .leaderboard-card:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 16px rgba(0, 255, 255, 0.4);
    }

    /* Title */
    .title {
        font-weight: bold;
        margin-bottom: 15px;
        font-size: 1.6rem;
        color: #00FFFF;
    }

    /* Description */
    .description {
        font-size: 1rem;
        color: #00EEEE;
        margin-bottom: 20px;
    }

    /* Table Styling */
    .leaderboard-table {
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
    }

    .leaderboard-table thead {
        background: #00FFFF;
        color: black;
    }

    .leaderboard-table th,
    .leaderboard-table td {
        padding: 10px;
        text-align: center;
    }

    .leaderboard-table tbody tr:hover {
        background: rgba(0, 255, 255, 0.1);
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
        .leaderboard-card {
            width: 75%;
            max-width: 450px;
        }

        .title {
            font-size: 1.4rem;
        }

        .description {
            font-size: 0.9rem;
        }
    }

    @media (max-width: 480px) {
        .leaderboard-card {
            width: 85%;
            max-width: 400px;
        }

        .title {
            font-size: 1.3rem;
        }

        .description {
            font-size: 0.85rem;
        }

        .leaderboard-table th,
        .leaderboard-table td {
            padding: 8px;
            font-size: 0.9rem;
        }
    }`;

export default LeaderBoardScreen;
