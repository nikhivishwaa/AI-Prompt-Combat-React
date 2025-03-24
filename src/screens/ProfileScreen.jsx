import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthProvider } from "../context/authContext";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const { token, isAuthenticated } = AuthProvider();

  const naviagtion = useNavigate();
  useEffect(() => {
    async function getProfile() {
      try {
        const cachedProfile = secureLocalStorage.getItem("profile");
        if (cachedProfile) {
          setUser(JSON.parse(cachedProfile));
        } else {
          const apiUrl = import.meta.env.VITE_BACKEND;
          const response = await axios.get(`${apiUrl}/profile/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            secureLocalStorage.setItem(
              "profile",
              JSON.stringify(response.data.data)
            );
            console.log(response.data);
            setUser(response.data.data);
          }
        }
      } catch (error) {
        console.log("Error while signing in: ", error);
        // if (error.name.includes("UserAlreadyAuthenticatedException")) {
        //   cloudwatchLogger({
        //     errorMessage: "Error while siginng in, login",
        //     errorObject: {
        //       message: error,
        //       stack: error.stack,
        //     },
        //   });
        // }
      }
    }
    isAuthenticated
      ? getProfile()
      : naviagtion("/login", {
          state: {
            next: "/profile",
          },
        });
  }, []);
  return (
    <>
      <style>{style}</style>
      {user ? (
        <div className="profile-container">
          <div className="profile-card">
            <h2 className="profile-title">My Profile</h2>

            <div className="profile-info">
              <div className="info-group">
                <label>Full Name:</label>
                <span>
                  {user?.first_name} {user?.last_name}
                </span>
              </div>

              <div className="info-group">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>

              <div className="info-group">
                <label>Gender:</label>
                <span>{user?.gender}</span>
              </div>

              <div className="info-group">
                <label>Mobile:</label>
                <span>{user?.phone}</span>
              </div>

              <div className="info-group">
                <label>College:</label>
                <span>{user?.college}</span>
              </div>

              <div className="info-group">
                <label>Member Since:</label>
                <span>
                  {new Date(user?.date_joined)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(" ", " ")
                    .replace(",", ",")}
                </span>
              </div>
            </div>

            <div className="profile-actions">
              <Link to="/logout" className="btn btn-danger">
                Logout
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-container">Loading</div>
      )}
    </>
  );
};

const style = `
.profile-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 150px);
        padding: 40px 20px;
        width: 100%;
        box-sizing: border-box;
    }

    .profile-card {
        background: rgba(20, 20, 20, 0.9);
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
        width: 90%;
        max-width: 600px;
        color: #00FFFF;
        transition: transform 0.3s ease;
    }

    .profile-card:hover {
        transform: translateY(-5px);
    }

    .profile-title {
        text-align: center;
        margin-bottom: 30px;
        font-size: 2rem;
        color: #00FFFF;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }

    .profile-info {
        margin-bottom: 30px;
    }

    .info-group {
        margin-bottom: 20px;
        padding: 15px;
        background: rgba(0, 255, 255, 0.1);
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: transform 0.3s ease, background-color 0.3s ease;
    }

    .info-group:hover {
        background: rgba(0, 255, 255, 0.15);
        transform: translateX(5px);
    }

    .info-group label {
        font-weight: bold;
        color: #00FFFF;
        text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
    }

    .info-group span {
        color: #ffffff;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
    }

    .profile-actions {
        text-align: center;
        margin-top: 30px;
    }

    .btn-danger {
        background: #ff4444;
        color: white;
        padding: 12px 25px;
        border-radius: 5px;
        text-decoration: none;
        transition: all 0.3s ease;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 4px 15px rgba(255, 68, 68, 0.3);
    }

    .btn-danger:hover {
        background: #cc0000;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 68, 68, 0.4);
    }

    @media (max-width: 768px) {
        .profile-card {
            padding: 25px;
            width: 95%;
        }

        .profile-title {
            font-size: 1.8rem;
        }

        .info-group {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            padding: 12px;
        }

        .info-group label {
            font-size: 0.9rem;
        }

        .info-group span {
            font-size: 1rem;
        }

        .btn-danger {
            padding: 10px 20px;
            font-size: 0.9rem;
        }
    }

    @media (max-width: 480px) {
        .profile-container {
            padding: 20px 10px;
        }

        .profile-card {
            padding: 20px;
        }

        .profile-title {
            font-size: 1.5rem;
        }

        .info-group {
            padding: 10px;
        }

        .info-group label {
            font-size: 0.85rem;
        }

        .info-group span {
            font-size: 0.95rem;
        }
    }
`;

export default ProfileScreen;
