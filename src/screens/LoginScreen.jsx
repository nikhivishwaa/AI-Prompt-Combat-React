import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { emailValidator } from "../helpers/validators";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

function LoginScreen({ isAuthenticated, getAuth }) {
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate();
  const route = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      if (route?.state?.next) {
        navigation(route?.state?.next);
      } else {
        navigation("/");
      }
    }
  }, [isAuthenticated]);

  const validateEmail = () => {
    if (!email.length) {
      setValidEmail(false);
      setEmailError("Please enter email / mobile no.");
    }
    if (isNaN(parseInt(email))) {
      if (!emailValidator(email)) {
        setValidEmail(false);
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
        setValidEmail(true);
      }
    } else {
      // validate phone number
      if (email.search(/^\d{10}$/) === -1) {
        setValidEmail(false);
        setEmailError("Please enter a valid phone number");
      } else {
        setEmailError("");
        setValidEmail(true);
      }
    }
  };

  const validatePassword = () => {
    if (!password.length) {
      setValidPassword(false);
      setPasswordError("Please enter password");
    } else if (password.length < 8) {
      setPasswordError("Password must be 8 character long");
      setValidPassword(false);
    } else {
      setPasswordError("");
      setValidPassword(true);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("checking login form");
    validateEmail();
    validatePassword();
    if (validEmail && validPassword) {
      console.log({ email, password });
      if (!confirm("Login")) return;
      setSubmitting(true);
      handleSignIn();
    }
  };
  async function handleSignIn() {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND;
      const response = await axios.post(
        `${apiUrl}/login/`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("You are logged in successfully");
        secureLocalStorage.setItem("auth", JSON.stringify(response.data.data));
        secureLocalStorage.setItem("lastLogin", new Date().getTime());
        getAuth();
        navigation("/profile", {
          replace: true,
          state: {
            status: response?.data?.status,
            message: response?.data?.message,
          },
        });
      } else alert(response.data?.message);
    } catch (error) {
      console.log("Error while signing in: ", error);
      alert("Something went wrong. Try again!");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{style}</style>

      <div className="container d-flex justify-content-center align-items-center">
        <div className="card login-card">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email / Mobile No.</label>
              <input
                readOnly={submitting}
                type="text"
                name="email"
                placeholder="Enter your email or mobile no."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
                onBlur={validateEmail}
                style={{ borderColor: validEmail ? "#555" : "red" }}
              />
              <span className="block text-[12px] font-medium py-1 px-[10px] text-[red]">
                {emailError}
              </span>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                readOnly={submitting}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
                style={{ borderColor: validPassword ? "#555" : "red" }}
                onBlur={validatePassword}
              />
              <div className="flex justify-start items-baseline my-1 mt-3 gap-1 w-full">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword((prev) => !prev)}
                  id="show_password"
                  style={{ boxShadow: "none", width: "fit-content" }}
                />
                <label
                  htmlFor="show_password"
                  className="text-[11px] self-center"
                >
                  Show Password
                </label>
              </div>

              <span className="block text-[12px] font-medium py-1 px-[10px] text-[red]">
                {passwordError}
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={
                submitting
                  ? {
                      cursor: "not-allowed",
                      boxShadow: "none",
                      background: "#34e9e9",
                    }
                  : {}
              }
              disabled={submitting}
            >
              Login
            </button>
          </form>

          <p className="text-center mt-3">
            Don't have an account?{" "}
            <Link to="/signup" className="text-highlight">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

const style = `
    /* Centering Container */
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    /* Card Styling */
    .login-card {
        background: #161B22;
        /* Dark grey (matches homepage) */
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 6px 12px rgba(0, 255, 136, 0.2);
        width: 90%;
        max-width: 400px;
        text-align: center;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        animation: fadeIn 0.8s ease-in-out;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Centering Login Title */
    .login-title {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        color: #00FFFF;
        /* Neon green */
        margin-bottom: 20px;
    }

    /* Hover Effect */
    .login-card:hover {
        transform: scale(1.02);
        box-shadow: 0 10px 20px #00FFFF;
        ;
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

    /* Input Group Styling */
    .input-group {
        margin-bottom: 20px;
        text-align: left;
    }

    .input-group label {
        font-weight: 600;
        margin-bottom: 5px;
        display: block;
        color: #00FFFF;
        /* Neon green for labels */
    }

    .input-group input {
        width: 100%;
        border-radius: 8px;
        border: 1px solid #555;
        background: #21262D;
        /* Darker input field */
        color: #ffffff;
        padding: 12px;
        font-size: 14px;
        transition: all 0.3s ease-in-out;
    }

    .input-group input:focus {
        border-color: #00FFFF;
        box-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
        outline: none;
    }

    /* Submit Button Styling */
    .submit-container {
        text-align: center;
        margin-top: 10px;
    }

    .btn-primary {
        padding: 12px 20px;
        font-size: 16px;
        border-radius: 8px;
        transition: all 0.3s ease-in-out;
        background-color: #00FFFF;
        /* Neon green button */
        border: none;
        color: #0D1117;
        box-shadow: 0 4px 10px#00FFFF;
        ;
        width: 100%;
        font-weight: bold;
    }

    .btn-primary:hover {
        background-color: #00FFFF;
        ;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px #00FFFF;
        ;
    }

    /* Alert Styling */
    .alert {
        background: rgba(255, 0, 0, 0.2);
        color: #ff4444;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        text-align: center;
    }

    /* Link Styling */
    .text-highlight {
        color: #00FFFF;
        ;
        /* Neon green */
        text-decoration: none;
        font-weight: bold;
    }

    .text-highlight:hover {
        text-decoration: underline;
    }
`;
export default LoginScreen;
