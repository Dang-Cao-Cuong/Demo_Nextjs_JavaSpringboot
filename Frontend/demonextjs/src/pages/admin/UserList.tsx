// src/pages/admin/UserList.tsx
import { useEffect, useState } from "react";
import { userApi } from "@/services";
import { message } from "antd";

const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Xoá user?")) return;
    try {
      await userApi.deleteUser(id);
      message.success("Xóa thành công");
      loadData();
    } catch (e) {
      message.error("Lỗi xóa user");
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Roles</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>{u.roles.join(", ")}</td>
            <td>
              <button onClick={() => handleDelete(u.id)}>Xoá</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;
