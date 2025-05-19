import React, { useEffect, useState } from "react";
import "../assets/css/login.css";
import logo from "../assets/images/in4logo.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { toggleSidebarTrue } from "../redux/reducers/sidebarReducer";
import { toggleSidebarfalse } from "../redux/reducers/sidebarReducer";
import {toggleAuthenticationTrue, toggleAuthenticationfalse} from "../redux/reducers/twoFactorReducer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateToken} from "../redux/reducers/authReducer";
import {updateServerToken } from "../redux/reducers/serverReducer";
import { login } from "../redux/reducers/authReducer";
import { toggleActiveTab } from "../redux/reducers/tabsReducer";
import { fetchOAuthToken } from "../utils/fectchOAuthToken";
import { setUserId, clearUserId } from "../redux/reducers/userIdReducer";


const AdminLogin = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [twoFactorDigits, setTwoFactorDigits] = useState("");
  const [twoFactorDigitsError, setTwoFactorDigitsError] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const isUserAuthenticated = useSelector((state) => state.authentication.isAuthenticated);
  const userId = useSelector((state) => state.userId.userId);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleSidebarfalse());
    dispatch(toggleActiveTab({ activeTab: 1 }));
    dispatch(updateServerToken({serverToken: ''}))
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
  
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberPassword(true);
    }
  }, []);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const validateForm = () => {
    let valid = true;
    if (!email) {
      setEmailError("Username is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Username is invalid");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    if (rememberPassword) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }

    if (validateForm()) {

    try {
            setIsSubmitting(true);
    
            const loginResponse = await fetch("http://localhost:4000/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                //Authorization: `Bearer ${tokenData.access_token}`,
              },
              body: JSON.stringify({
                email: email,
                password: password,
              }),
            });
      
            const loginData = await loginResponse.json();
      
            if (loginResponse.ok) {
              setIsSubmitting(false);
              setTwoFactorDigits(""); 
              dispatch(toggleAuthenticationTrue());
              dispatch(
              login({
                user: loginData.details,
              })
            );
            dispatch(toggleSidebarTrue());
              navigate("/Dashboard");
            } else {
              setIsSubmitting(false);
              toast.error(`Invalid credentails. Verify & try again!`);
            }
          } catch (error) {
            // Handle network error during login request
            setIsSubmitting(false);
            toast.error(
              "Network error.",
              "Please check your network connection and try again.Please check your network connection and try again"
            );
          }
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left side with logo */}
        <div className="login-logo-section">
         <div className="login-branding">
      <h1>KPI Portal</h1>
      <p>Driving Performance. Empowering Decisions. Enabling Growth.</p>
    </div>

        </div>

        {/* Right side with forms */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <div className="login-card">
                <form className="auth-form">
                  <h2>Access Your KPI Dashboard</h2>
                    <p className="auth-subtitle">Monitor performance. Drive results. Sign in to continue.</p>

                  <div className="form-field">
                    <label>Username</label>
                    <input
                      type="text"
                      value={email || ""}
                      placeholder="example@kpi.com.na"
                      onChange={(e) => {
                        setEmailError("");
                        setEmail(e.target.value);
                      }}
                      className={emailError ? "error-input" : ""}
                    />
                    {emailError && <span className="error-message">{emailError}</span>}
                  </div>

                  <div className="form-field">
                    <label>Password</label>
                    <div className="password-input">
                      <input
                        type={passwordShown ? "text" : "password"}
                        value={password || ""}
                        placeholder="Enter your password"
                        onChange={(e) => {
                          setPasswordError("");
                          setPassword(e.target.value);
                        }}
                        className={passwordError ? "error-input" : ""}
                      />
                      <button 
                        type="button"
                        className="toggle-password"
                        onClick={togglePassword}
                      >
                        {passwordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </button>
                    </div>
                    {passwordError && <span className="error-message">{passwordError}</span>}
                  </div>

                  <div className="form-actions">
                    <label className="remember-me">
                      <input
                        type="checkbox"
                        checked={rememberPassword}
                        onChange={() => setRememberPassword(!rememberPassword)}
                      />
                      <span>Remember me</span>
                    </label>
                    <button 
                      type="button"
                      className="forgot-password"
                      onClick={() => navigate("/email")}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <div className="loader"></div> : "Sign in"}
                  </button>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
