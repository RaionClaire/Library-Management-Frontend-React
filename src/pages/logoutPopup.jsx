import React from "react";
import "../styles/logoutPopup.css";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/api";

export default function LogoutPopup({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    apiClient.post("/logout");
    navigate("/login");
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Keluar dari akun ini?</h2>

        <img
          src={new URL("../asset/keluar.png", import.meta.url).href}
          alt="Confirm Logout"
          className="popup-image"
        />

        <div className="popup-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Batal
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
