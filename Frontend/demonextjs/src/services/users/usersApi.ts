import { getAllUsers } from './getAllUsers';
import { getMyInfo } from './getMyInfo';
import { createUser } from './createUser';
import { updateUser } from './updateUser';
import { deleteUser } from './deleteUser';

export const usersApi = {
  getAllUsers,
  getMyInfo,
  createUser,
  updateUser,
  deleteUser,
};

export default usersApi;
