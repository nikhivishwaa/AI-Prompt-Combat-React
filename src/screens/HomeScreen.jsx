import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import ReverseTimer from "../components/ReverseTimer";
import ChallengeCard from "../components/ChallengeCard";

const HomeScreen = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const navigation = useNavigate();
  const route = useLocation();

  useEffect(() => {
    async function getChallenges() {
      try {
        const apiUrl = import.meta.env.VITE_BACKEND;
        const response = await axios.get(`${apiUrl}/challenge/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          secureLocalStorage.setItem(
            "events",
            JSON.stringify(response.data.data)
          );
          secureLocalStorage.setItem("lastEventRefresh", new Date().getTime());
          setEvents(response.data.data);
        }
      } catch (error) {
        console.log("Error while fetching events in: ", error);
        // if (error.name.includes("UserAlreadyAuthenticatedException")) {
        //   cloudwatchLogger({
        //     errorMessage: "Error while siginng in, login",
        //     errorObject: {
        //       message: error,
        //       stack: error.stack,
        //     },
        //   });
        // }
      } finally {
        setLoading(false);
      }
    }
    getChallenges();
  }, []);

  return (
    <>
      <style>{style}</style>
      {!loading ? (
        <section className="event-section">
          {events.length ? (
            events.map((challenge, i) => (
              <ChallengeCard challenge={challenge} key={i} />
            ))
          ) : (
            <div className="event-card">
              <img src="/home_Image.png" alt="Combat the Prompt" />
              <div className="event-info">
                <h2>No Events Available</h2>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="event-section">
          <div className="event-card">
            <img src="/home_Image.png" alt="Combat the Prompt" />
            <div className="event-info">
              <h2>Loading ....</h2>
            </div>
          </div>
        </section>
      )}

      {/* <!-- Footer Spacing --> */}
      <div className="footer-spacing"></div>
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
          width: 100%;
          padding: 30px 0;
          position: relative;
          z-index: 10;
          flex: 1;
      }
  
      /* Event Card Styling */
      .event-card {
          background: rgba(20, 20, 20, 0.9);
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
          overflow: hidden;
          padding: 20px;
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          max-width: 620px;
          width: 90%;
          margin: auto;
          position: relative;
          z-index: 10;
      }
  
      .event-card img {
          width: 96%;
          margin: 2%;
          max-height: 300px;
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

export default HomeScreen;
