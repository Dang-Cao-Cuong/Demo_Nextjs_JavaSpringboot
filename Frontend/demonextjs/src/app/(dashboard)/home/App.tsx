import Machine from "./components/machine";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import UserList from "./pages/admin/UserList";
import CreateUser from "./pages/admin/CreateUser";
import RoleList from "./pages/admin/RoleList";

function App() {

  return (

    <>
      <h1>Quản lý máy móc</h1>
      <BrowserRouter>
      <Routes>
        <Route
          path="/admin/users"
          element={<AdminRoute><UserList /></AdminRoute>}
        />
        <Route
          path="/admin/users/create"
          element={<AdminRoute><CreateUser /></AdminRoute>}
        />
        <Route
          path="/admin/roles"
          element={<AdminRoute><RoleList /></AdminRoute>}
        />
      </Routes>
    </BrowserRouter>
      <Machine />
    </>
  )
}

export default App;
