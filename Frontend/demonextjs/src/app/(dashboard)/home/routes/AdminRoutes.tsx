import { Route } from "react-router-dom";
import AdminRoute from "../new/AdminRoute";
import UserList from "../pages/admin/UserList";
import CreateUser from "../pages/admin/CreateUser";
import RoleList from "../pages/admin/RoleList";

const AdminRoutes: React.FC = () => {
  return (
    <>
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UserList />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users/create"
        element={
          <AdminRoute>
            <CreateUser />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/roles"
        element={
          <AdminRoute>
            <RoleList />
          </AdminRoute>
        }
      />
    </>
  );
};

export default AdminRoutes;
