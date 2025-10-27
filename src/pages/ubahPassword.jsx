import React, { useState } from "react";
import "../styles/ubahPassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiClient from "../utils/api";
import { useNavigate } from "react-router-dom";

const UbahPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    try {
      setLoading(true);
      
      await apiClient.put("/profile", {
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setSuccess("Password changed successfully!");
      
      // Clear form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate("/profil");
      }, 2000);
    } catch (err) {
      console.error("Password change error:", err);
      setError(err.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ubahpassword-container">
      <div className="ubahpassword-box">
        <h2 className="ubahpassword-title">Change Password</h2>
        <p className="ubahpassword-subtitle">Change your password here</p>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>{error}</div>}
        {success && <div className="success-message" style={{ color: 'green', marginBottom: '15px', padding: '10px', backgroundColor: '#e6ffe6', borderRadius: '5px' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
              />
              <span onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Verify New Password</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                minLength={8}
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="simpan-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UbahPassword;
