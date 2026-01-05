
import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../api/userApi";

const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);

  const loadData = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Xoá user?")) return;
    await deleteUser(id);
    loadData();
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
