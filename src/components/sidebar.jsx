import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import LogoutPopup from "../pages/logoutPopup.jsx";
import {
  LayoutGrid,
  Book,
  ClipboardList,
  Settings,
  User,
  Bell,
  LogOut,
  ChevronDown,
  ChevronUp,
  Home,
} from "lucide-react";
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
    { path: "/home", label: "Beranda", icon: <Home /> },
    { path: "/totalBuku", label: "Total Buku", icon: <Book /> },
    { path: "/authors", label: "Penulis", icon: <User /> },
    { path: "/categories", label: "Kategori", icon: <LayoutGrid /> },
    {
      path: "/peminjaman",
      label: "Peminjaman Aktif",
      icon: <ClipboardList />,
    },
    {
      path: "/member-fines",
      label: "Denda Saya",
      icon: <Bell />,
    },
  ];

  const settingsItems = [
    { path: "/profil", label: "Profil", icon: <User /> },
    { path: "/notification", label: "Notifikasi", icon: <Bell /> },
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
                <span className="icon"><LayoutGrid /></span>
                <span>Admin Dashboard</span>
              </Link>
            </li>
          )}

          <li
            className="dropdown"
            onClick={handleSettingsToggle}
          >
            <span className="icon">
              <Settings />
            </span>
            <span>Pengaturan</span>
            {openSettings ? (
              <ChevronUp className="arrow-icon" />
            ) : (
              <ChevronDown className="arrow-icon" />
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
              <LogOut />
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
