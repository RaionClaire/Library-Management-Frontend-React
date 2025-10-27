import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import LogoutPopup from "../pages/logoutPopup.jsx";
import {
  FaThLarge,
  FaBook,
  FaClipboardList,
  FaCog,
  FaUser,
  FaBell,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaHome,
} from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openSettings, setOpenSettings] = useState(false);
  const [showLogout, setShowLogout] = useState(false); // ⬅️ state untuk popup
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const menuItems = [
    { path: "/home", label: "Beranda", icon: <FaHome /> },
    { path: "/totalBuku", label: "Total Buku", icon: <FaBook /> },
    { path: "/authors", label: "Penulis", icon: <FaUser /> },
    { path: "/categories", label: "Kategori", icon: <FaThLarge /> },
    {
      path: "/peminjaman",
      label: "Peminjaman Aktif",
      icon: <FaClipboardList />,
    },
    {
      path: "/member-fines",
      label: "Denda Saya",
      icon: <FaBell />,
    },
  ];

  const settingsItems = [
    { path: "/profil", label: "Profil", icon: <FaUser /> },
    { path: "/notification", label: "Notifikasi", icon: <FaBell /> },
  ];

  const handleSettingsToggle = (e) => {
    e.stopPropagation();
    setOpenSettings(!openSettings);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogout(true);
  };

  return (
    <>
      <div className="sidebar">
        <h2 className="sidebar-title">E-Library</h2>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={currentPath === item.path ? "active" : ""}
            >
              <Link to={item.path}>
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          {user && (user.role === "admin" || user.role?.name === "admin") && (
            <li
              className={currentPath === "/admin" ? "active" : ""}
            >
              <Link to="/admin">
                <span className="icon"><FaThLarge /></span>
                <span>Admin Dashboard</span>
              </Link>
            </li>
          )}

          <li
            className="dropdown"
            onClick={handleSettingsToggle}
          >
            <span className="icon">
              <FaCog />
            </span>
            <span>Pengaturan</span>
            {openSettings ? (
              <FaChevronUp className="arrow-icon" />
            ) : (
              <FaChevronDown className="arrow-icon" />
            )}
          </li>

          {openSettings && (
            <ul className="submenu" onClick={(e) => e.stopPropagation()}>
              {settingsItems.map((item) => (
                <li
                  key={item.path}
                  className={currentPath === item.path ? "active" : ""}
                >
                  <Link to={item.path}>
                    <span className="icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Tombol keluar */}
          <li onClick={handleLogoutClick} style={{ cursor: "pointer" }}>
            <span className="icon">
              <FaSignOutAlt />
            </span>
            <span>Keluar</span>
          </li>
        </ul>
      </div>

      {/* Popup Logout */}
      <LogoutPopup isOpen={showLogout} onClose={() => setShowLogout(false)} />
    </>
  );
};

export default Sidebar;
