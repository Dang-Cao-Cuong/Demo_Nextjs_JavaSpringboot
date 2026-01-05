import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/machine";
import Login from "../../../(auth)/login/page";
import AdminRoutes from "./AdminRoutes";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <AdminRoutes />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
