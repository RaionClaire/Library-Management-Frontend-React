import React, { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import "../styles/profil.css";
import { Link } from "react-router-dom";
import apiClient from "../utils/api";

const defaultAvatar = new URL("../asset/profil.png", import.meta.url).href;

export default function Profil() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/me");
      const userData = response.data?.user || response.data;
      setUser({
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || '',
        avatar: userData.avatar || defaultAvatar,
      });
      // Also update localStorage
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setNotif({
        show: true,
        message: "Failed to load profile data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("Saving user data:", user);
      
      const updateData = {
        name: user.name,
        email: user.email,
      };

      const response = await apiClient.put("/profile", updateData);
      
      // Update local storage with new data
      const updatedUser = response.data?.user || response.data;
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser({
          ...user,
          ...updatedUser,
          avatar: updatedUser.avatar || user.avatar,
        });
      }

      setIsEditing(false);
      setNotif({
        show: true,
        message: "Profile updated successfully!",
        type: "success",
      });
      setTimeout(() => setNotif({ show: false }), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setNotif({
        show: true,
        message: error.response?.data?.message || "Failed to update profile",
        type: "error",
      });
      setTimeout(() => setNotif({ show: false }), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profil-container">
      <div className="profil-card">
        <h2>My Profile</h2>

        {loading ? (
          <div className="loading-state">Loading profile...</div>
        ) : (
          <>
            <div className="profil-foto-container">
              <img src={user.avatar || defaultAvatar} alt="Profile Avatar" className="profil-foto" />
              <label htmlFor="upload-foto" className="edit-foto-icon">
                <FaPen />
              </label>
              <input
                id="upload-foto"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>

            <div className="profil-form">
              <label>Full Name</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="name"
                  value={user.name || ''}
                  disabled={!isEditing}
                  onChange={handleChange}
                />
                {!isEditing && <FaPen className="edit-icon" onClick={() => setIsEditing(true)} />}
              </div>

              <label>Email</label>
              <div className="input-with-icon">
                <input
                  type="email"
                  name="email"
                  value={user.email || ''}
                  disabled={!isEditing}
                  onChange={handleChange}
                />
                {!isEditing && <FaPen className="edit-icon" onClick={() => setIsEditing(true)} />}
              </div>

              {user.role && (
                <>
                  <label>Role</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={user.role.name}
                      disabled
                      style={{ textTransform: 'capitalize' }}
                    />
                  </div>
                </>
              )}

              <Link to="/ubahPassword">
                <button className="ubah-password-btn">Change Password</button>
              </Link>

              {isEditing && (
                <button 
                  className="simpan-btn" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </>
        )}

        {notif.show && (
          <div className={`notif-popup ${notif.type}`}>{notif.message}</div>
        )}
      </div>
    </div>
  );
}
