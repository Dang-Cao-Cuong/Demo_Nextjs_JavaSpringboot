import { Navigate } from "react-router-dom";
import React from "react";

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Chưa đăng nhập
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Không phải ADMIN
  if (role !== "ADMIN") {
    return <Navigate to="/403" replace />;
  }

  // Đúng quyền
  return children;
};

export default AdminRoute;
