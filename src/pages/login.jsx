import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import apiClient from "../utils/api";

const gambarlogin = new URL("../asset/gambarlogin.png", import.meta.url).href;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔎 Attempting login", { email });
      const response = await apiClient.post("/login", {
        email,
        password,
      });

      console.log("✅ Login response", response.data);
      
      // Store the token
      const token = response?.data?.access_token || response?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }

      // Store user data (includes role)
      const user = response?.data?.user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect based on role
        const userRole = user?.role?.name || user?.role;
        if (userRole === 'admin') {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error("❌ Login error", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* === Bagian kiri === */}
      <div className="login-left">
        <div className="welcome-section">
          <img
            src={new URL("../asset/logo.png", import.meta.url).href}
            alt="logo aplikasi"
            className="login-logo"
          />
          <div className="welcome-text-inline">
            <span className="welcome">Welcome</span>
            <span className="back">Back!</span>
          </div>
        </div>

        <img src={gambarlogin} alt="gambarlogin" className="gambarlogin" />
      </div>

      {/* === Bagian kanan === */}
      <div className="login-right">
        <div className="login-box">
          <h2>Hello! Welcome back.</h2>
          <p>Login with the data you entered during Registration.</p>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleLogin}>
            <label>
              Email Address<span className="required">*</span>
            </label>
            <input
              type="email"
              placeholder="fatima001@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>
              Password<span className="required">*</span>
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>

            <div className="forgot-password">
              <Link to="/lupaPassword">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login Now"}
            </button>
          </form>

          <p className="register-text">
            Don’t have an Account? <Link to="/register">register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
