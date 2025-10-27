import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireRole({ roles = [] }) {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  
  // Handle both user.role and user.role.name formats
  const role = user?.role?.name || user?.role;

  if (!role || (roles.length && !roles.includes(role))) {
    // Redirect based on role
    const redirectPath = role === "admin" ? "/admin" : "/home";
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}
