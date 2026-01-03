import { useEffect, useState } from "react";
import {
  getRoles,
  createRole,
  deleteRole,
} from "../../api/roleApi";

interface Role {
  name: string;
  description: string;
}

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const res = await getRoles();
      setRoles(res.data);
    } catch (err) {
      alert("Không tải được danh sách role");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Tên role không được trống");

    try {
      await createRole({ name, description });
      setName("");
      setDescription("");
      loadRoles();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ ADMIN mới được tạo role");
      } else {
        alert("Tạo role thất bại");
      }
    }
  };

  const handleDelete = async (roleName: string) => {
    if (!window.confirm(`Xoá role ${roleName}?`)) return;

    try {
      await deleteRole(roleName);
      loadRoles();
    } catch (err: any) {
      alert("Không thể xoá role");
    }
  };

  return (
    <div>
      <h2>Role Management</h2>

      {/* FORM CREATE ROLE */}
      <form onSubmit={handleCreate}>
        <input
          placeholder="Role name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">➕ Thêm role</button>
      </form>

      {/* LIST ROLE */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td>{r.description}</td>
                <td>
                  <button onClick={() => handleDelete(r.name)}>
                    ❌ Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RoleList;
