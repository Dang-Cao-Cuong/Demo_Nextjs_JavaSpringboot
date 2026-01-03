import axiosClient from "./axiosClient";

export const getRoles = () => {
  return axiosClient.get("/roles");
};

export const createRole = (data: {
  name: string;
  description: string;
}) => {
  return axiosClient.post("/roles", data);
};

export const deleteRole = (name: string) => {
  return axiosClient.delete(`/roles/${name}`);
};
