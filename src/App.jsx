import { useEffect, useState } from "react";
// import viteLogo from '/vite.svg'
import "./App.css";

import HomeScreen from "./screens/HomeScreen";
import { Route, Routes } from "react-router-dom";
import LeaderBoardScreen from "./screens/LeaderBoardScreen";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import RulesScreen from "./screens/RulesScreen";
import CompetitionScreen from "./screens/CompetitionScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ContactScreen from "./screens/ContactScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import LogoutScreen from "./screens/LogoutScreen";
import { AuthProvider } from "./context/authContext";

function App() {
  const [count, setCount] = useState(0);
  const user = AuthProvider();
  console.log({ user });
  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      const bubble = document.createElement("div");
      bubble.className =
        "bubble absolute w-12 h-12 bg-cyan-300 opacity-60 rounded-full animate-floatUp";
      bubble.style.left = Math.random() * 100 + "vw";
      bubble.style.animationDuration = Math.random() * 5 + 5 + "s";
      document.body.appendChild(bubble);
    }
  }, []);

  return (
    <>
      <style>{style}</style>
      <Navbar isAuthenticated={user.isAuthenticated} />
      <div className="overlay"></div>

      {/* <!-- Main Content --> */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 100px)",
          height: "100%",
        }}
      >
        <Routes>
          <Route path="/" element={<HomeScreen user={1} />} />
          {/* <Route path="/leaderboard" element={<LeaderBoardScreen user={1} />} /> */}
          <Route path="/rules" element={<RulesScreen />} />
          <Route path="/competition" element={<CompetitionScreen user={1} />} />
          <Route path="/profile" element={<ProfileScreen user={1} />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route
            path="/signup"
            element={<SignupScreen isAuthenticated={user.isAuthenticated} />}
          />
          <Route
            path="/login"
            element={
              <LoginScreen
                isAuthenticated={user.isAuthenticated}
                getAuth={user.initiateAuthConfirmation}
              />
            }
          />
          <Route
            path="/logout"
            element={<LogoutScreen getAuth={user.initiateAuthConfirmation} />}
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

const style = `
  /* Background Styling with Gradient */
  body {
      background: linear-gradient(135deg, #0F2027, #203A43, #2C5364);
      color: #00FFFF;
      font-family: 'Poppins', sans-serif;
      margin: 0;
      overflow-x: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
  }


  /* Responsive Design */
  @media (max-width: 1024px) {
      
      /* Overlay */
      .overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 98;
      }

      .overlay.active {
          display: block;
      }
  }

  

  /* Floating Background Bubbles */
  .bubble {
      position: absolute;
      width: 50px;
      height: 50px;
      background: radial-gradient(circle, rgba(0, 255, 255, 0.8), rgba(0, 255, 255, 0.1));
      border-radius: 50%;
      opacity: 0.6;
      z-index: 1;
      animation: floatUp 5s infinite linear;
  }

  @keyframes floatUp {
      0% {
          transform: translateY(calc(100vh - 60px)) translateX(0);
          opacity: 0.3;
      }

      50% {
          opacity: 0.4;
      }

      100% {
          transform: translateY(-calc(100vh - 60px)) translateX(40px);
          opacity: 0;
      }
  }
`;

export default App;
