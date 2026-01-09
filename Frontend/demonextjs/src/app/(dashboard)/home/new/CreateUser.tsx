"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./CreateUser.css";
import { Color } from "antd/es/color-picker";

const CreateUser = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };


  const validate = () => {
    const err: any = {};
    if (form.username.length < 6) err.username = "Tên đăng nhập ≥ 6 ký tự";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Email không hợp lệ";
    if (form.password.length < 8) err.password = "Mật khẩu ≥ 8 ký tự";
    return err;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          fullName: form.fullName,
          email: form.email,
          roles: [form.role],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 👇 BẮT LỖI USERNAME TRÙNG
        if (data.message?.includes("Username")) {
          setErrors({ username: data.message });
          return;
        }

        throw new Error("Tạo user thất bại");
      }

      alert("Tạo người dùng thành công");
      router.push("/home");

    } catch (err) {
      alert("Lỗi hệ thống");
    }
  };


  return (
    <div className="create-user">
      <h2>Thêm người dùng</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên đăng nhập *</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p className="error">{errors.username}</p>
          )}
        </div>


        <div className="form-group">
          <label>Họ và tên <span color="red">*</span></label>
          <input name="fullName" value={form.fullName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email <span color="red">*</span></label>
          <input name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Mật khẩu <span color="red">*</span></label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button disabled={loading} type="submit">
          {loading ? "Đang tạo..." : "Thêm người dùng"}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
