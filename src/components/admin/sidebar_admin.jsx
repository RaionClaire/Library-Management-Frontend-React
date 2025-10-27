import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../sidebar.css";
import LogoutPopup from "../../pages/logoutPopup.jsx";
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
  Users,
  DollarSign,
  BookOpen,
} from "lucide-react";
import { FaBookOpenReader } from "react-icons/fa6";

const SidebarAdmin = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openSettings, setOpenSettings] = useState(false);
  const [openManagement, setOpenManagement] = useState(false);
  const [showLogout, setShowLogout] = useState(false); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <LayoutGrid /> },
  ];

  const managementItems = [
    { path: "/admin/books", label: "Manage Books", icon: <Book /> },
    { path: "/admin/authors", label: "Manage Authors", icon: <User /> },
    { path: "/admin/categories", label: "Manage Categories", icon: <BookOpen /> },
    { path: "/admin/loans", label: "Manage Loans", icon: <FaBookOpenReader /> },
    { path: "/admin/fines", label: "Manage Fines", icon: <DollarSign /> },
    { path: "/admin/users", label: "Manage Users", icon: <Users /> },
  ];

  const settingsItems = [
    { path: "/profil", label: "Profil", icon: <User /> },
    { path: "/notification", label: "Notifikasi", icon: <Bell /> },
  ];

  const handleSettingsToggle = (e) => {
    e.stopPropagation();
    setOpenSettings(!openSettings);
  };

  const handleManagementToggle = (e) => {
    e.stopPropagation();
    setOpenManagement(!openManagement);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogout(true);
  };

  return (
    <>
      <div className="sidebar">
        <h2 className="sidebar-title">E-Library Admin</h2>
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

          <li
            className="dropdown"
            onClick={handleManagementToggle}
          >
            <span className="icon">
              <Settings />
            </span>
            <span>Management</span>
            {openManagement ? (
              <ChevronUp className="arrow-icon" />
            ) : (
              <ChevronDown className="arrow-icon" />
            )}
          </li>

          {openManagement && (
            <ul className="submenu" onClick={(e) => e.stopPropagation()}>
              {managementItems.map((item) => (
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

          <li
            className="dropdown"
            onClick={handleSettingsToggle}
          >
            <span className="icon">
              <Settings />
            </span>
            <span>Settings</span>
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
            <span>Logout</span>
          </li>
        </ul>
      </div>

      {/* Popup Logout */}
      <LogoutPopup isOpen={showLogout} onClose={() => setShowLogout(false)} />
    </>
  );
};

export default SidebarAdmin;
