import React, { useState } from "react";
import "../styles/register.css";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../utils/api";

// ✅ Gunakan new URL agar path gambar selalu benar di semua bundler
const logo = new URL("../asset/logo.png", import.meta.url).href;
const gambarregister = new URL("../asset/gambarregister.png", import.meta.url)
  .href;
const gambarorange = new URL("../asset/gambarorange.png", import.meta.url).href;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("member");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (password !== passwordConfirmation) {
        throw new Error("Password confirmation does not match");
      }

      const response = await apiClient.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* === Kiri: Box putih === */}
      <div className="register-left">
        <div className="signup-box">
          <h3 className="register-title">
            Please Fill this form to create an Account
          </h3>

          {error && <p className="error-message">{error}</p>}

          {/* ✅ Panggil handleSubmit di form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Full Name <span>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Email Address <span>*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group password-group">
              <label>
                Password <span>*</span>
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
            </div>

            <div className="form-group password-group">
              <label>
                Confirm Password <span>*</span>
              </label>
              <div className="password-input">
                <input
                  type={showPasswordConfirmation ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  minLength={8}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                >
                  {showPasswordConfirmation ? <EyeOff /> : <Eye />}
                </span>
              </div>
            </div>


            {/* ✅ Tombol Sign Up */}
            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="login-link">
              Already have an account? <Link to="/login">LOGIN</Link>
            </p>
          </form>
        </div>
      </div>

      {/* === Kanan: Gambar dan teks === */}
      <div className="register-right">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="register-text">
          Explore the World <br />
          <span className="highlight">with BOOKS</span>
        </h2>
        <img
          src={gambarregister}
          alt="Register Illustration"
          className="gambarregister"
        />
        <img src={gambarorange} alt="Orange Shape" className="gambarorange" />
      </div>
    </div>
  );
};

export default Register;
