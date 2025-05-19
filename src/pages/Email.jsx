import React, { useState } from "react";
import "../assets/css/login.css";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchOAuthToken } from "../utils/fectchOAuthToken";

function Email() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const serverToken = useSelector((state) => state.server.serverToken);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");

    if (validateForm()) {
      try {
          setIsSubmitting(true);
          const response = await fetch("http://localhost:4000/auth/forgot-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${tokenData.access_token}`,
            },
            body: JSON.stringify({
              email
            }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
              setIsSubmitting(false);
              setEmail("");
              toast.success(data.message);
              
          } else {
            setIsSubmitting(false);
            toast.error("Username not found in our database. Verify username and try again!");
          }
        } catch (error) {
          setIsSubmitting(false);
          toast.error(
            "Network error. Please check your network connection and try again",
            "Please check your network connection and try again"
          );
        }
      
    }
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
    return valid;
  };
  return (
    <div className="login-container">
      <div className="login-wrapper-centered">
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <h1 className="login-title">A Digital Solution</h1>
            
            <div className="login-card">
              <form onSubmit={handleSubmit} className="auth-form">
                <h2>Reset Your Password</h2>
<p className="auth-subtitle">
  Please enter your registered email address below. If an account exists with that email, 
  you’ll receive instructions to reset your password.
                </p>

                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    placeholder="example@kpi.com.na"
                    onChange={(e) => {
                      setEmailError("");
                      setEmail(e.target.value);
                    }}
                    className={emailError ? "error-input" : ""}
                  />
                  {emailError && (
                    <span className="error-message">{emailError}</span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="loader"></div>
                  ) : (
                    "Reset"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="back-button"
                >
                  {/* <ArrowBackIosNewIcon sx={{ fontSize: 16, marginRight: 1 }} /> */}
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Email;