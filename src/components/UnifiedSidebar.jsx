import React, { useState } from "react";
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
  FaUsers,
  FaDollarSign,
  FaBookReader,
} from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";

const UnifiedSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openSettings, setOpenSettings] = useState(false);
  const [openManagement, setOpenManagement] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  // Get user role
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role?.name || user?.role || "member";

  // All menu items with their allowed roles
  const allMenuItems = [
    // Member-only items
    {
      path: "/home",
      label: "Beranda",
      icon: <FaHome />,
      roles: ["member"],
    },
    {
      path: "/totalBuku",
      label: "Total Buku",
      icon: <FaBook />,
      roles: ["member"],
    },
    {
      path: "/authors",
      label: "Penulis",
      icon: <FaUser />,
      roles: ["member"],
    },
    {
      path: "/categories",
      label: "Kategori",
      icon: <FaThLarge />,
      roles: ["member"],
    },
    {
      path: "/peminjaman",
      label: "Peminjaman Aktif",
      icon: <FaClipboardList />,
      roles: ["member"],
    },
    {
      path: "/member-fines",
      label: "Denda Saya",
      icon: <FaDollarSign />,
      roles: ["member"],
    },
    // Admin-only items
    {
      path: "/admin",
      label: "Dashboard",
      icon: <FaThLarge />,
      roles: ["admin"],
    },
  ];

  const managementItems = [
    {
      path: "/admin/books",
      label: "Manage Books",
      icon: <FaBook />,
      roles: ["admin"],
    },
    {
      path: "/admin/authors",
      label: "Manage Authors",
      icon: <FaUser />,
      roles: ["admin"],
    },
    {
      path: "/admin/categories",
      label: "Manage Categories",
      icon: <FaBookReader />,
      roles: ["admin"],
    },
    {
      path: "/admin/loans",
      label: "Manage Loans",
      icon: <FaBookOpenReader />,
      roles: ["admin"],
    },
    {
      path: "/admin/fines",
      label: "Manage Fines",
      icon: <FaDollarSign />,
      roles: ["admin"],
    },
    {
      path: "/admin/users",
      label: "Manage Users",
      icon: <FaUsers />,
      roles: ["admin"],
    },
  ];

  const settingsItems = [
    {
      path: "/profil",
      label: "Profil",
      icon: <FaUser />,
      roles: ["member", "admin"],
    },
    {
      path: "/notification",
      label: "Notifikasi",
      icon: <FaBell />,
      roles: ["member", "admin"],
    },
  ];

  // Filter menu items based on role
  const filteredMenuItems = allMenuItems.filter((item) =>
    item.roles.includes(role)
  );
  const filteredManagementItems = managementItems.filter((item) =>
    item.roles.includes(role)
  );
  const filteredSettingsItems = settingsItems.filter((item) =>
    item.roles.includes(role)
  );

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

  const sidebarTitle = role === "admin" ? "E-Library Admin" : "E-Library";

  return (
    <>
      <div className="sidebar">
        <h2 className="sidebar-title">{sidebarTitle}</h2>
        <ul className="sidebar-menu">
          {/* Main Menu Items */}
          {filteredMenuItems.map((item) => (
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

          {/* Management Dropdown (Admin only) */}
          {filteredManagementItems.length > 0 && (
            <>
              <li className="dropdown" onClick={handleManagementToggle}>
                <span className="icon">
                  <FaCog />
                </span>
                <span>Management</span>
                {openManagement ? (
                  <FaChevronUp className="arrow-icon" />
                ) : (
                  <FaChevronDown className="arrow-icon" />
                )}
              </li>

              {openManagement && (
                <ul className="submenu" onClick={(e) => e.stopPropagation()}>
                  {filteredManagementItems.map((item) => (
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
            </>
          )}

          {/* Settings Dropdown */}
          <li className="dropdown" onClick={handleSettingsToggle}>
            <span className="icon">
              <FaCog />
            </span>
            <span>{role === "admin" ? "Settings" : "Pengaturan"}</span>
            {openSettings ? (
              <FaChevronUp className="arrow-icon" />
            ) : (
              <FaChevronDown className="arrow-icon" />
            )}
          </li>

          {openSettings && (
            <ul className="submenu" onClick={(e) => e.stopPropagation()}>
              {filteredSettingsItems.map((item) => (
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

          {/* Logout */}
          <li onClick={handleLogoutClick} style={{ cursor: "pointer" }}>
            <span className="icon">
              <FaSignOutAlt />
            </span>
            <span>{role === "admin" ? "Logout" : "Keluar"}</span>
          </li>
        </ul>
      </div>

      {/* Popup Logout */}
      <LogoutPopup isOpen={showLogout} onClose={() => setShowLogout(false)} />
    </>
  );
};

export default UnifiedSidebar;
