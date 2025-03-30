import React, { useEffect, useState } from "react";
import { emailValidator, passwordValidator } from "../helpers/validators";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function SignupScreen({ isAuthenticated }) {
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);
  const [userInput, setUserInput] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    phone: "",
    email: "",
    college: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState({
    first_nameError: "",
    lnameError: "",
    genderError: "",
    phoneError: "",
    emailError: "",
    collegeError: "",
    passwordError: "",
    repasswordError: "",
  });

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
  }, []);

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  // check first name
  const validateFname = () => {
    if (userInput.first_name.length < 3) {
      return "First Name must have 3 or more characters";
    } else if (userInput.first_name.trim().search(/^[a-zA-Z]{3,}$/)) {
      return "First Name must have alphabets only";
    } else {
      return "";
    }
  };
  // check last name if given
  const validateLname = () => {
    if (userInput.last_name.length) {
      let last_name = userInput.last_name.trim();
      if (
        last_name.search(/^[a-z\sA-Z]{2,}$/) !== 0 ||
        last_name.search(/\s{2,}/) !== -1
      ) {
        return "Remove extra spaces or number from Last Name";
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  // check gender
  const validateGender = () => {
    if (!userInput.gender) return "Please select gender";
    else return "";
  };

  // check email
  const validateEmail = () => {
    if (!userInput.email.length) return "Please enter email";
    else if (!emailValidator(userInput.email))
      return "Please enter a valid email address";
    else {
      return "";
    }
  };

  // check phone
  const validatePhone = () => {
    if (!userInput.phone.length) return "Please enter phone number";
    else if (userInput.phone.search(/^\d{10}$/) === -1)
      return "Please enter a valid phone number";
    else return "";
  };

  // check college
  const validateCollege = () => {
    if (userInput.college.trim().length < 3) {
      return "Please enter college name properly";
    } else {
      return "";
    }
  };
  // check password
  const validatePassword = () => {
    if (!userInput.password.length) {
      return "Please enter password";
    } else if (userInput.password.length < 8) {
      return "Password must be 8 character long";
    } else if (!passwordValidator(userInput.password)) {
      return "Password must contain alphanumeric (a-z, A-Z, 0-9) and @, !, $, %, ^, &, *, (, ), +, -, ?, /";
    } else {
      return "";
    }
  };

  // check confirm password
  const validateRepassword = () => {
    if (!userInput.confirm_password.length) {
      return "Please enter confirm password";
    } else if (userInput.confirm_password !== userInput.password) {
      return "Confirm Password should be same as password";
    } else if (userInput.confirm_password === userInput.password) {
      return validatePassword();
    } else {
      return "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    console.log("checking login form");
    const checks = {};
    checks.first_nameError = validateFname();
    checks.lnameError = validateLname();
    checks.genderError = validateGender();
    checks.phoneError = validatePhone();
    checks.emailError = validateEmail();
    checks.collegeError = validateCollege();
    checks.passwordError = validatePassword();
    checks.repasswordError = validateRepassword();

    setError(checks);
    let errorCount = 0;
    for (const err in checks) {
      errorCount += checks[err].length ? 1 : 0;
    }
    if (!errorCount) {
      console.log(userInput);
      if (!confirm("Create Account")) return;
      setSubmitting(true);
      handleSignUp();
    }
  };

  async function handleSignUp() {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND;
      const response = await axios.post(`${apiUrl}/signup/`, userInput, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        console.log(response.data);
        alert("Account has been created. Login Now!");
        navigation("/login", {
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
        <div className="card signup-card">
          <h2 className="signup-title">Sign Up for AI Prompt Combat</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="first_name">First Name</label>
              <input
                readOnly={submitting}
                type="text"
                name="first_name"
                id="first_name"
                placeholder="Enter your first name"
                value={userInput.fna}
                onChange={handleChange}
                required={true}
                style={{
                  borderColor: !error.first_nameError.length ? "#555" : "red",
                }}
              />
              <span className="block text-[12px] font-medium py-1 px-[10px] text-[red]">
                {error?.first_nameError}
              </span>
            </div>
            <div className="input-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                readOnly={submitting}
                type="text"
                name="last_name"
                id="last_name"
                placeholder="Enter your last name"
                value={userInput?.last_name}
                onChange={handleChange}
                style={{
                  borderColor: !error.lnameError.length ? "#555" : "red",
                }}
              />
              <span className="block text-[12px] font-medium py-1 px-[10px] text-[red]">
                {error?.lnameError}
              </span>
            </div>

            <div className="input-group">
              <label htmlFor="gender">Gender</label>
              <div id="gender" className="flex justify-start gap-10">
                <span className="flex gap-2 justify-center items-baseline">
                  <input
                    readOnly={submitting}
                    type="radio"
                    id="male"
                    name="gender"
                    value="m"
                    onChange={handleChange}
                  />
                  <label htmlFor="male" className="font-normal text-[14px]">
                    Male
                  </label>
                </span>
                <span className="flex gap-2 justify-center items-baseline">
                  <input
                    readOnly={submitting}
                    type="radio"
                    id="female"
                    name="gender"
                    value="f"
                    onChange={handleChange}
                  />
                  <label htmlFor="female" className="font-normal text-[14px]">
                    Female
                  </label>
                </span>
              </div>
              <span className="block text-[12px] font-medium py-1 px-[10px] text-[red]">
                {error?.genderError}
              </span>
            </div>

            <div className="input-group">
              <label htmlFor="phone">Mobile Number</label>
              <input
                readOnly={submitting}
                type="tel"
                name="phone"
                id="phone"
                pattern="[0-9]{10}"
                placeholder="Enter 10-digit mobile number"
                value={userInput?.phone}
                onChange={handleChange}
                required={true}
                style={{
                  borderColor: !error.phoneError.length ? "#555" : "red",
                }}
              />
              <span className="block text-[12px] font-medium py-1 px-[10px] text-[red]">
                {error?.phoneError}
              </span>
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                readOnly={submitting}
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email or mobile no."
                value={userInput?.email}
                onChange={handleChange}
                required={true}
                style={{
                  borderColor: !error.emailError.length ? "#555" : "red",
                }}
              />
              <span className="block text-[12px] font-medium py-1 px-[10px] text-[red]">
                {error?.emailError}
              </span>
            </div>

            <div className="input-group">
              <label htmlFor="college">College Name</label>
              <input
                readOnly={submitting}
                type="text"
                name="college"
                id="college"
                placeholder="Enter your college name"
                value={userInput?.college}
                onChange={handleChange}
                required={true}
                style={{
                  borderColor: !error.collegeError.length ? "#555" : "red",
                }}
              />
              <span className="block text-[12px] font-medium py-1 px-[10px] text-[red]">
                {error?.collegeError}
              </span>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                readOnly={submitting}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                value={userInput?.password}
                onChange={handleChange}
                required={true}
                style={{
                  borderColor: !error.passwordError.length ? "#555" : "red",
                }}
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
                {error.passwordError}
              </span>
            </div>

            <div className="input-group">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input
                readOnly={submitting}
                type={showRepassword ? "text" : "password"}
                name="confirm_password"
                id="confirm_password"
                placeholder="Confirm your password"
                value={userInput?.confirm_password}
                onChange={handleChange}
                required={true}
                style={{
                  borderColor: !error.repasswordError.length ? "#555" : "red",
                }}
              />
              <div className="flex justify-start items-baseline my-1 mt-3 gap-1 w-full">
                <input
                  type="checkbox"
                  checked={showRepassword}
                  onChange={(e) => setShowRepassword((prev) => !prev)}
                  id="show_repassword"
                  style={{ boxShadow: "none", width: "fit-content" }}
                />
                <label
                  htmlFor="show_repassword"
                  className="text-[11px] self-center"
                >
                  Show Confirm Password
                </label>
              </div>
              <span className="block text-[12px] font-medium py-1 px-[10px] text-[red]">
                {error?.repasswordError}
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
              Sign Up
            </button>
          </form>

          <p className="text-center mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-highlight">
              Login
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
  min-height: 90vh;
  padding: 30px;
}

/* Card Styling */
.signup-card {
  background: #161B22;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 5px 15px rgba(0, 255, 136, 0.2);
  width: 100%;
  max-width: 450px;
  /* Ensures responsiveness */
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
  transition: transform 0.3s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Sign-Up Title */
.signup-title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: #00FFFF;
  /* Neon Cyan */
  margin-bottom: 15px;
}

/* Hover Effect */
.signup-card:hover {
  transform: scale(1.02);
}

/* Input Group Styling */
.input-group {
  text-align: left;
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #00FFFF;
}

/* Fixing input overflow issue */
.input-group input {
  width: 100%;
  /* Ensures input fields fit inside the card */
  padding: 12px;
  border: 1px solid #555;
  background: #21262D;
  color: #ffffff;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  font-size: 14px;
  box-sizing: border-box;
  /* Prevents padding from increasing width */
}

/* Input Field Focus Effect */
.input-group input:focus {
  border-color: #00FFFF;
  box-shadow: 0px 0px 8px rgba(0, 255, 255, 0.7);
  outline: none;
}

/* Placeholder Text */
.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* Submit Button */
.btn-primary {
  padding: 10px;
  font-size: 0.9rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  background: #00FFFF;
  color: #0D1117;
  width: 100%;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 255, 136, 0.3);
}

.btn-primary:hover {
  background: #00FFFF;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px #00FFFF;
}

/* Alert Box */
.alert {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  text-align: center;
}

/* Highlighted Text (Neon Cyan Links) */
.text-highlight {
  color: #00FFFF;
  text-decoration: none;
  font-weight: bold;
}

.text-highlight:hover {
  text-decoration: underline;
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
@media (max-width: 500px) {
  .signup-card {
      max-width: 90vw;
      padding: 15px;
  }

  .input-group input {
      padding: 10px;
  }

  .btn-primary {
      padding: 8px;
      font-size: 0.85rem;
  }
}
`;

export default SignupScreen;
