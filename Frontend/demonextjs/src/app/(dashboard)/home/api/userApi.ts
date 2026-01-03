import axiosClient from "./axiosClient";

export const getUsers = () => {
  return axiosClient.get("/users");
};

export const createUser = (data: {
  username: string;
  password: string;
  fullName: string;
  email: string;
  roles: string[];
}) => {
  return axiosClient.post("/users", data);
};

export const updateUser = (
  id: string,
  data: {
    password?: string;
    fullName: string;
    email: string;
    roles: string[];
  }
) => {
  return axiosClient.put(`/users/${id}`, data);
};

export const deleteUser = (id: string) => {
  return axiosClient.delete(`/users/${id}`);
};

export const getMyInfo = () => {
  return axiosClient.get("/users/myInfo");
};
