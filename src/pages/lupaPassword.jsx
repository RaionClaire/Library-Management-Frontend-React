import React, { useState } from "react";
import "../styles/lupaPassword.css";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../utils/sweetAlert";

const LupaPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would make an API call to send a password reset email
    showSuccess("Reset Link Sent!", `Password reset link sent to ${email}`);
    navigate("/login");
  };

  return (
    <div className="lupapassword-container">
      <div className="lupapassword-box">
        <h2 className="lupapassword-title">Forgot Password</h2>
        <p className="lupapassword-subtitle">Enter your email to reset your password</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="simpan-btn">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default LupaPassword;
