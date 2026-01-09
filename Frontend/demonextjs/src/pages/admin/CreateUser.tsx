import { useEffect, useState } from "react";
import { userApi, rolesApi } from "@/services";

const CreateUser = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [form, setForm] = useState<any>({
    username: "",
    password: "",
    fullName: "",
    email: "",
    roles: [],
  });

  useEffect(() => {
    rolesApi.getAllRoles().then((data) =>
      setRoles(data.map((r: any) => r.name))
    );
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      await userApi.createUser(form);
      alert("Tạo user thành công");
    } catch (e: any) {
      alert("Lỗi: " + e.message);
    }
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <input placeholder="Full name" onChange={e => setForm({ ...form, fullName: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />

      <select multiple onChange={(e) =>
        setForm({
          ...form,
          roles: Array.from(e.target.selectedOptions, o => o.value)
        })
      }>
        {roles.map(r => <option key={r}>{r}</option>)}
      </select>

      <button>Tạo user</button>
    </form>
  );
};

export default CreateUser;
