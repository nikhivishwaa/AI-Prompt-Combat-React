import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isAuthenticated }) => {
  const [menuActive, setMenuActive] = useState(false);
  const route = useLocation();
  useEffect(() => {
    const handleOverlayClick = () => setMenuActive(false);
    document
      .querySelectorAll(".nav-link")
      .forEach((link) => link.addEventListener("click", handleOverlayClick));
    return () => {
      document
        .querySelectorAll(".nav-link")
        .forEach((link) =>
          link.removeEventListener("click", handleOverlayClick)
        );
    };
  }, []);

  return (
    <>
      {/* <header className="sticky top-0 z-50">
        <nav className="bg-black bg-opacity-90 text-cyan-300 border-b-2 border-cyan-300 p-3 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/static/challenge/img/k22.jpg"
              alt="Logo"
              className="h-12 mr-4 hover:scale-110 transition-transform"
            />
            <h2 className="text-xl font-bold">KAGGLE KODER'S</h2>
          </div>

          <div
            className={`hamburger ${menuActive ? "active" : ""}`}
            onClick={() => setMenuActive(!menuActive)}
          >
            <span className="block w-6 h-1 bg-cyan-300 mb-1 transition-all"></span>
            <span className="block w-6 h-1 bg-cyan-300 mb-1 transition-all"></span>
            <span className="block w-6 h-1 bg-cyan-300 transition-all"></span>
          </div>

          <div
            className={`navbar-right ${
              menuActive ? "right-0" : "right-[-100%]"
            } fixed top-0 w-3/4 h-screen bg-black bg-opacity-95 flex flex-col items-center justify-center transition-all z-40 p-6`}
          >
            <Link
              to="/home"
              className="nav-link text-cyan-300 hover:text-yellow-400"
            >
              Home
            </Link>
            <Link
              to="/rules"
              className="nav-link text-cyan-300 hover:text-yellow-400"
            >
              Rules
            </Link>
            <Link
              to="/leaderboard"
              className="nav-link text-cyan-300 hover:text-yellow-400"
            >
              Leaderboard
            </Link>
            <Link
              to="/contact"
              className="nav-link text-cyan-300 hover:text-yellow-400"
            >
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="nav-link text-cyan-300 hover:text-yellow-400"
                >
                  Profile
                </Link>
                <Link
                  to="/logout"
                  className="nav-link text-cyan-300 hover:text-yellow-400"
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-link text-cyan-300 hover:text-yellow-400"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="nav-link text-cyan-300 hover:text-yellow-400"
                >
                  SignUp
                </Link>
              </>
            )}
          </div>

          {menuActive && (
            <div
              className="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-30"
              onClick={() => setMenuActive(false)}
            ></div>
          )}
        </nav>
      </header> */}
      <style>{style}</style>

      {/* <!-- Navbar --> */}
      <header style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <nav className="navbar">
          <Link to="/">
            <div className="navbar-left">
              <img src="/k22.jpg" alt="Logo" />
              <h2>KAGGLE KODER'S</h2>
            </div>
          </Link>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="navbar-right">
            <Link to="/" className="link">
              Home
            </Link>
            <Link to="/rules" className="link">
              Rules
            </Link>

            {route.path === "/competition" && route?.state?.challenge_id && (
              <Link to="/challenge" className="link">
                Competition
              </Link>
            )}
            {/* <Link to="/leaderboard" className="link">
              Leaderboard
            </Link> */}
            <Link to="/contact" className="link">
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="link">
                  Profile
                </Link>
                <Link to="/logout" className="link">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="link">
                  Login
                </Link>
                <Link to="/signup" className="link">
                  SignUp
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

const style = `
        /* Navbar */
        .navbar {
            background: rgba(20, 20, 20, 0.9);
            padding: 10px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #00FFFF;
            position: relative;
        }

        .navbar-left {
            display: flex;
            align-items: center;
        }

        .navbar img {
            height: 50px;
            margin-right: 15px;
            transition: transform 0.3s;
        }

        .navbar img:hover {
            transform: scale(1.1);
        }

        .navbar h2 {
            margin: 0;
            font-size: 22px;
            font-weight: bold;
            color: #00FFFF;
        }

        .navbar-right {
            display: flex;
            align-items: center;
        }

        .navbar-right .link {
            text-decoration: none;
            color: #00FFFF;
            font-weight: bold;
            margin: 0 15px;
            position: relative;
            transition: color 0.3s;
        }

        .navbar-right .link:hover {
            color: #FFD700;
        }

        .navbar-right .link::after {
            content: "";
            display: block;
            width: 0;
            height: 2px;
            background: #FFD700;
            transition: width 0.3s;
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
        }

        .navbar-right .link:hover::after {
            width: 100%;
        }

        /* Hamburger Menu */
        .hamburger {
            display: none;
            cursor: pointer;
            padding: 10px;
            z-index: 100;
        }

        .hamburger span {
            display: block;
            width: 25px;
            height: 3px;
            background: #00FFFF;
            margin: 5px 0;
            transition: all 0.3s ease;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .hamburger {
                display: block;
            }

            .navbar-right {
                position: fixed;
                top: 0;
                right: -100%;
                width: 70%;
                height: 100vh;
                background: rgba(20, 20, 20, 0.95);
                flex-direction: column;
                justify-content: center;
                transition: right 0.3s ease;
                z-index: 99;
                padding: 20px;
            }

            .navbar-right.active {
                right: 0;
            }

            .navbar-right .link {
                margin: 15px 0;
                font-size: 1.2rem;
            }

            /* Hamburger Animation */
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }

            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }

            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }

        @media (max-width: 768px) {
            .navbar h2 {
                font-size: 18px;
            }

            .navbar img {
                height: 40px;
            }
        }

        /* Footer */
        .footer {
            background: rgba(20, 20, 20, 0.9);
            color: #00FFFF;
            text-align: center;
            padding: 10px 0;
            width: 100%;
            border-top: 2px solid #00FFFF;
            margin-top: auto;
        }
`;
export default Navbar;
