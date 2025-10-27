import { useState } from "react";
import "../styles/AdminDashboard.css";
import { FaBook, FaUserEdit, FaTags, FaClipboardList, FaDollarSign, FaChartBar } from "react-icons/fa";

import BooksTable from "../components/BooksTable.jsx";
import AuthorsTable from "../components/AuthorsTable.jsx";
import CategoriesTable from "../components/CategoriesTable.jsx";
import LoansTable from "../components/LoansTable.jsx";
import FinesTable from "../components/FinesTable.jsx";
import Reports from "../components/Reports.jsx";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("books");

  const menuItems = [
    { id: "books", label: "Manage Books", icon: <FaBook /> },
    { id: "authors", label: "Manage Authors", icon: <FaUserEdit /> },
    { id: "categories", label: "Manage Categories", icon: <FaTags /> },
    { id: "loans", label: "Manage Loans", icon: <FaClipboardList /> },
    { id: "fines", label: "Manage Fines", icon: <FaDollarSign /> },
    { id: "reports", label: "Reports", icon: <FaChartBar /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "books":
        return <BooksTable />;
      case "authors":
        return <AuthorsTable />;
      case "categories":
        return <CategoriesTable />;
      case "loans":
        return <LoansTable />;
      case "fines":
        return <FinesTable />;
      case "reports":
        return <Reports />;
      default:
        return <BooksTable />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar-menu">
        <h3 className="admin-menu-title">Admin Menu</h3>
        <ul className="admin-menu-list">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`admin-menu-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="admin-menu-icon">{item.icon}</span>
              <span className="admin-menu-label">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
