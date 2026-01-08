"use client";

import React, { useState } from "react";
import "./CreateUser.css";

interface UserForm {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  status: string;
}

const CreateUser: React.FC = () => {
  const [form, setForm] = useState<UserForm>({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    role: "USER",
    status: "ACTIVE",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User data:", form);

    // TODO: gọi API POST /users
  };

  return (
    <div className="create-user">
      <h2>Thêm người dùng</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Họ và tên</label>
          <input
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Vai trò</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-submit">
          Thêm người dùng
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
